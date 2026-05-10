
-- ============ ENUM ROLE ============
CREATE TYPE public.app_role AS ENUM ('admin', 'cashier', 'warehouse_manager', 'owner');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES (separate table for security) ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ============ LOCATIONS ============
CREATE TABLE public.locations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_selling_point BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id BIGSERIAL PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_name ON public.products(name);

-- ============ PRODUCT STOCKS ============
CREATE TABLE public.product_stocks (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  location_id BIGINT NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, location_id)
);
ALTER TABLE public.product_stocks ENABLE ROW LEVEL SECURITY;

-- ============ SUPPLIERS ============
CREATE TABLE public.suppliers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- ============ TRANSACTIONS ============
CREATE TABLE public.transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_code TEXT NOT NULL UNIQUE,
  cashier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  location_id BIGINT REFERENCES public.locations(id) ON DELETE SET NULL,
  total_price NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  final_price NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  cash_received NUMERIC,
  cash_change NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_cashier ON public.transactions(cashier_id);

-- ============ TRANSACTION ITEMS ============
CREATE TABLE public.transaction_items (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price_at_transaction NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;

-- ============ STOCK MOVEMENTS ============
CREATE TABLE public.stock_movements (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  from_location_id BIGINT REFERENCES public.locations(id),
  to_location_id BIGINT REFERENCES public.locations(id),
  quantity INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale','stock_in','transfer','adjustment','return')),
  reference_id TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_stock_movements_created_at ON public.stock_movements(created_at DESC);
CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id);

-- ============ AUTO PROFILE + DEFAULT ROLE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- First user becomes admin, others become cashier by default
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cashier');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ AUTO STOCK DECREMENT + MOVEMENT ON SALE ============
CREATE OR REPLACE FUNCTION public.handle_sale_stock()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_location_id BIGINT;
  v_code TEXT;
BEGIN
  SELECT location_id, transaction_code INTO v_location_id, v_code
    FROM public.transactions WHERE id = NEW.transaction_id;

  -- Decrement stock at the selling location (insert row if missing)
  INSERT INTO public.product_stocks (product_id, location_id, quantity)
  VALUES (NEW.product_id, v_location_id, -NEW.quantity)
  ON CONFLICT (product_id, location_id)
  DO UPDATE SET quantity = public.product_stocks.quantity - NEW.quantity,
                updated_at = now();

  -- Record movement
  INSERT INTO public.stock_movements (product_id, from_location_id, to_location_id, quantity, type, reference_id)
  VALUES (NEW.product_id, v_location_id, NULL, NEW.quantity, 'sale', v_code);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_transaction_item_insert
  AFTER INSERT ON public.transaction_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_sale_stock();

-- ============ UPDATED_AT TRIGGER HELPER ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER product_stocks_updated_at BEFORE UPDATE ON public.product_stocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "view own profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'owner'));
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- user_roles: only admin manages; users can read their own
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- master data: any authenticated user reads; admin/warehouse manager writes
CREATE POLICY "auth read categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'));

CREATE POLICY "auth read locations" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage locations" ON public.locations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'));

CREATE POLICY "auth read products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'));

CREATE POLICY "auth read stocks" ON public.product_stocks FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage stocks" ON public.product_stocks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'));

CREATE POLICY "auth read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage suppliers" ON public.suppliers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager'));

-- transactions: cashier creates own; admin/owner read all; cashier reads own
CREATE POLICY "read own or admin transactions" ON public.transactions FOR SELECT TO authenticated
  USING (cashier_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'owner'));
CREATE POLICY "create transactions" ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (cashier_id = auth.uid());
CREATE POLICY "admin manage transactions" ON public.transactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "read own transaction items" ON public.transaction_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.transactions t WHERE t.id = transaction_id AND
    (t.cashier_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'owner'))));
CREATE POLICY "create transaction items" ON public.transaction_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.transactions t WHERE t.id = transaction_id AND t.cashier_id = auth.uid()));

-- stock movements: read for authenticated; insert for admin/warehouse_manager + system trigger
CREATE POLICY "auth read movements" ON public.stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage movements" ON public.stock_movements FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'warehouse_manager') OR true);

-- ============ SEED DATA ============
INSERT INTO public.categories (name) VALUES ('Makanan'),('Minuman'),('Snack'),('Lainnya');
INSERT INTO public.locations (name, is_selling_point) VALUES
  ('Gudang Utama', false),
  ('Toko Cabang A', true);
