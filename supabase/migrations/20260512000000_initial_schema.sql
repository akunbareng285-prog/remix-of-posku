-- 1. Tabel Users (Auth diurus Supabase, ini untuk profil tambahan)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'cashier', -- roles: admin, cashier, warehouse_manager, owner
  avatar_url TEXT
);

-- 2. Tabel Kategori Produk
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 3. Tabel Lokasi (Gudang vs Toko)
CREATE TABLE locations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- Contoh: "Gudang Utama", "Toko Cabang A"
  is_selling_point BOOLEAN DEFAULT FALSE -- TRUE jika ini lokasi kasir
);

-- 4. Tabel Produk Master
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL, -- Stock Keeping Unit / Barcode
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id BIGINT REFERENCES categories(id),
  unit TEXT NOT NULL, -- Contoh: pcs, box, kg
  purchase_price NUMERIC, -- Harga Beli (Modal)
  selling_price NUMERIC NOT NULL, -- Harga Jual Default
  min_stock_level INTEGER DEFAULT 5 -- Batas peringatan stok tipis
);

-- 5. Tabel Stok per Lokasi (Crucial!)
CREATE TABLE product_stocks (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  location_id BIGINT REFERENCES locations(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  UNIQUE(product_id, location_id)
);

-- 6. Tabel Supplier
CREATE TABLE suppliers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT
);

-- 7. Tabel Transaksi Penjualan (Kasir)
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_code TEXT UNIQUE NOT NULL, -- Contoh: TRX-20231027-001
  cashier_id UUID REFERENCES profiles(id),
  location_id BIGINT REFERENCES locations(id), -- Lokasi toko tempat penjualan
  total_price NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  final_price NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- Contoh: Cash, QRIS, Transfer
  cash_received NUMERIC, -- Uang yang diterima (jika cash)
  cash_change NUMERIC, -- Uang kembalian
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. Tabel Item Transaksi Penjualan (Detail)
CREATE TABLE transaction_items (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT REFERENCES transactions(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_transaction NUMERIC NOT NULL, -- Simpan harga saat transaksi terjadi
  subtotal NUMERIC NOT NULL
);

-- 9. Tabel Mutasi Stok (Audit Trail - PENTING!)
CREATE TABLE stock_movements (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  from_location_id BIGINT REFERENCES locations(id),
  to_location_id BIGINT REFERENCES locations(id),
  quantity INTEGER NOT NULL,
  type TEXT NOT NULL, -- types: 'sale', 'stock_in', 'transfer', 'adjustment', 'return'
  reference_id TEXT, -- ID Transaksi, ID Barang Masuk, dll.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);