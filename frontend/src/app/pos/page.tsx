'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Search, Plus, Minus, Trash2, LogOut, ShoppingCart, Receipt, Store, Users, ChevronDown, QrCode, Banknote, CheckCircle2, Clock, ExternalLink, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  unit?: string;
}

interface Location {
  id: string;
  name: string;
  type: string;
}

interface CartItem extends Product {
  quantity: number;
}

const initialProducts: Product[] = [
  { id: 1, sku: 'KPM01', name: 'Kopi Kenangan Mantan', price: 24000, stock: 12, category: 'MINUMAN', image: '/products/kopi-kenangan.png' },
  { id: 2, sku: 'RC01', name: 'Roti Coklat', price: 15000, stock: 8, category: 'MAKANAN', image: '/products/roti-coklat.png' },
  { id: 3, sku: 'ET01', name: 'Es Teh Tarik', price: 10000, stock: 25, category: 'MINUMAN', image: '/products/es-teh-tarik.png' },
  { id: 4, sku: 'MG01', name: 'Mie Goreng Spesial', price: 22000, stock: 5, category: 'MAKANAN', image: '/products/mie-goreng.png' },
  { id: 5, sku: 'AM01', name: 'Air Mineral 600ml', price: 5000, stock: 50, category: 'MINUMAN', image: '/products/air-mineral.png' },
  { id: 6, sku: 'KK01', name: 'Keripik Kentang', price: 12000, stock: 15, category: 'SNACK', image: '/products/keripik-kentang.png' },
];

export default function PosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [userName, setUserName] = useState<string>('Kasir');
  const [userRole, setUserRole] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('Tunai');
  const [cashInput, setCashInput] = useState<number>(0);
  
  // Midtrans Sandbox QRIS state
  const [isMidtransModalOpen, setIsMidtransModalOpen] = useState(false);
  const [midtransOrderId, setMidtransOrderId] = useState('');
  const [midtransStatus, setMidtransStatus] = useState<'pending' | 'settlement' | 'expire'>('pending');
  const [midtransTimer, setMidtransTimer] = useState(300);
  const [isSimulatingSuccess, setIsSimulatingSuccess] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Receipt state
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{ items: CartItem[]; total: number; date: string; id: string; paymentMethod: string } | null>(null);

  const [categories, setCategories] = useState(['SEMUA', 'MAKANAN', 'MINUMAN', 'SNACK']);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const role = localStorage.getItem('pos_role');
    const name = localStorage.getItem('pos_user_name');
    if (!role) {
      router.push('/login');
    } else {
      setUserRole(role);
      setUserName(name || role);
    }

    // Load products from localStorage
    const savedProducts = localStorage.getItem('pos_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    // Load categories from localStorage
    const savedCategories = localStorage.getItem('pos_categories');
    if (savedCategories) setCategories(['SEMUA', ...JSON.parse(savedCategories)]);

    // Load locations
    const savedLocs = localStorage.getItem('pos_locations');
    const locs: Location[] = savedLocs
      ? JSON.parse(savedLocs)
      : [
          { id: 'LOC-1', name: 'Gudang Utama', type: 'warehouse' },
          { id: 'LOC-2', name: 'Toko Pusat', type: 'store' },
          { id: 'LOC-3', name: 'Cabang Depok', type: 'store' },
        ];
    setLocations(locs.filter((l) => (l as any).isActive !== false));

    // Load stock map
    const sm = localStorage.getItem('pos_stock_map');
    if (sm) setStockMap(JSON.parse(sm));
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMidtransModalOpen && midtransStatus === 'pending' && midtransTimer > 0) {
      interval = setInterval(() => {
        setMidtransTimer((prev) => {
          if (prev <= 1) {
            setMidtransStatus('expire');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMidtransModalOpen, midtransStatus, midtransTimer]);

  const handleStartMidtransQris = () => {
    const orderId = `MID-POS-${Date.now().toString().slice(-8)}`;
    setMidtransOrderId(orderId);
    setMidtransStatus('pending');
    setMidtransTimer(300);
    setIsPayModalOpen(false);
    setIsMidtransModalOpen(true);
  };

  const handleSimulateMidtransSuccess = () => {
    setIsSimulatingSuccess(true);
    setTimeout(() => {
      setMidtransStatus('settlement');
      setIsSimulatingSuccess(false);

      setTimeout(() => {
        setIsMidtransModalOpen(false);
        handleConfirmPayment('QRIS');
      }, 1200);
    }, 800);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('pos_role');
    localStorage.removeItem('pos_user_name');
    router.push('/login');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('SEMUA');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'SEMUA' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAvailableStock = (product: Product) => {
    if (selectedLocation) {
      return stockMap[`${product.id}-${selectedLocation.id}`] ?? product.stock;
    }
    return product.stock;
  };

  const addToCart = (product: Product) => {
    const existingInCart = cart.find((item) => item.id === product.id);
    const quantityInCart = existingInCart ? existingInCart.quantity : 0;
    const available = getAvailableStock(product);
    if (available <= quantityInCart) {
      alert(`Stok produk "${product.name}" di ${selectedLocation?.name || 'lokasi ini'} habis!`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;

          // Check stock when increasing
          if (delta > 0 && item.stock <= item.quantity) {
            alert(`Stok produk "${item.name}" tidak mencukupi!`);
            return item;
          }

          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Keranjang kosong!');
    setCashInput(Math.ceil(total / 1000) * 1000);
    setIsPayModalOpen(true);
  };

  const handleConfirmPayment = (overrideMethod?: string) => {
    const activeMethod = overrideMethod || paymentMethod;
    const transactionId = `TRX-${Date.now().toString().slice(-6)}`;
    const transactionDate = new Date().toLocaleString('id-ID');
    setLastTransaction({ id: transactionId, date: transactionDate, items: [...cart], total, paymentMethod: activeMethod });

    // 2. Update stock in localStorage
    const currentProducts: Product[] = JSON.parse(localStorage.getItem('pos_products') || '[]');
    const updatedProducts = currentProducts.map((p) => {
      const cartItem = cart.find((item) => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });

    localStorage.setItem('pos_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    // Also update stock_map for the selected location
    if (selectedLocation) {
      const updated = { ...stockMap };
      cart.forEach((item) => {
        const key = `${item.id}-${selectedLocation.id}`;
        const cur = updated[key] ?? item.stock;
        updated[key] = Math.max(0, cur - item.quantity);
      });
      setStockMap(updated);
      localStorage.setItem('pos_stock_map', JSON.stringify(updated));
    }

    // 3. Save Transaction to localStorage
    const newTransaction = {
      id: transactionId,
      date: transactionDate,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
      })),
      total: total,
      cashier: userName,
      location: selectedLocation?.name || (userRole === 'ADMIN' ? 'Pusat' : 'Cabang Depok'),
      paymentMethod: activeMethod,
      timestamp: Date.now(),
    };

    const savedTransactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
    localStorage.setItem('pos_transactions', JSON.stringify([newTransaction, ...savedTransactions]));

    // 4. Save Mutations to localStorage
    const newMutations = cart.map((item) => ({
      id: `MUT-${Date.now()}-${item.id}`,
      date: transactionDate,
      product: item.name,
      qty: item.quantity,
      from: selectedLocation?.name || (userRole === 'ADMIN' ? 'Pusat' : 'Cabang Depok'),
      to: 'Pelanggan (Penjualan)',
      type: 'sale',
      status: 'Selesai',
      timestamp: Date.now(),
    }));

    const savedMutations = JSON.parse(localStorage.getItem('pos_mutations') || '[]');
    localStorage.setItem('pos_mutations', JSON.stringify([...newMutations, ...savedMutations]));

    // 5. Open receipt modal
    setIsPayModalOpen(false);
    setIsReceiptModalOpen(true);
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* ===== LOCATION SELECTION SCREEN ===== */}
      {!selectedLocation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-orange-400 via-primary to-orange-600 p-6 overflow-hidden">
          {/* Abstract Background Effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />

          {/* Main Card */}
          <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-scale-in border border-white/50">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center justify-center gap-3 mb-6">
                <img src="/logo_color.png" alt="POS Logo" className="h-14 w-auto object-contain drop-shadow-sm" />
                <div>
                  <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">POS System</p>
                  <p className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase mt-1">Multi-Location</p>
                </div>
              </div>
              <div className="text-[1.75rem] font-bold text-slate-900 tracking-tight leading-tight mb-2">Pilih Lokasi Kasir</div>
              <p className="text-slate-500 text-sm">
                Halo, <span className="font-semibold text-slate-700">{userName}</span>! Silakan pilih lokasi operasional Anda saat ini.
              </p>
            </div>

            <div className="space-y-3">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-primary/50 shadow-sm hover:shadow-md text-left transition-all duration-300 group active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:bg-primary/10 group-hover:border-primary/20 flex items-center justify-center shrink-0 transition-colors">
                    <Store size={22} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 group-hover:text-primary text-base transition-colors">{loc.name}</p>
                    <p className="text-slate-500 text-xs font-medium capitalize mt-0.5">{loc.type === 'store' ? 'Toko Retail' : 'Gudang Utama'}</p>
                  </div>
                  <div className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              {userRole === 'KASIR' ? (
                <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 text-rose-500 hover:text-rose-600 text-sm font-semibold transition-colors group">
                  <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Keluar Aplikasi
                </button>
              ) : (
                <Link href="/" className="inline-flex items-center justify-center gap-2 text-slate-500 hover:text-primary text-sm font-semibold transition-colors group">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Kembali ke Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Left: Cart Panel */}
      <div className="w-[380px] min-w-[380px] bg-white border-r border-card-border flex flex-col">
        {/* Cart Header */}
        <div className="px-5 py-4 border-b border-card-border flex items-center gap-3">
          {userRole === 'KASIR' ? (
            <button onClick={handleLogout} className="pro-button-ghost !p-2 !rounded-lg" title="Logout">
              <LogOut size={18} />
            </button>
          ) : (
            <Link href="/" className="pro-button-ghost !p-2 !rounded-lg" title="Kembali ke Dashboard">
              <ArrowLeft size={18} />
            </Link>
          )}
          <div className="flex-1">
            <h2 className="text-base font-semibold text-text-primary">Transaksi</h2>
            <p className="text-xs text-text-muted flex items-center gap-1">
              {userName} •
              <button
                onClick={() => {
                  setSelectedLocation(null);
                  setCart([]);
                }}
                className="text-primary font-semibold hover:underline"
              >
                {selectedLocation?.name || 'Pilih Lokasi'}
              </button>
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
            <ShoppingCart size={14} className="text-text-muted" />
            <span className="text-xs font-semibold text-text-primary">{totalItems}</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Receipt size={24} className="text-text-muted" />
              </div>
              <p className="text-sm font-semibold text-text-secondary">Keranjang Kosong</p>
              <p className="text-xs text-text-muted mt-1">Pilih produk di sebelah kanan</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-card-border group hover:bg-slate-100/80 transition-colors">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-card-border shrink-0 relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{item.name}</p>
                  <p className="text-xs text-text-muted">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-lg bg-white border border-card-border flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Minus size={12} className="text-text-secondary" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-text-primary">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-lg bg-white border border-card-border flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Plus size={12} className="text-text-secondary" />
                  </button>
                </div>
                <div className="text-right shrink-0 ml-1">
                  <p className="text-sm font-semibold text-text-primary">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-red-50 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary & Pay */}
        <div className="border-t border-card-border">
          <div className="px-5 py-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-medium text-text-primary">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">PPN (11%)</span>
              <span className="font-medium text-text-secondary">Rp {Math.round(tax).toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-2 border-t border-card-border flex justify-between">
              <span className="text-base font-semibold text-text-primary">Total</span>
              <span className="text-xl font-bold text-primary">Rp {Math.round(total).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="p-4 pt-0">
            <button onClick={handleCheckout} disabled={cart.length === 0} className="pro-button-primary w-full py-3.5 text-base font-bold">
              <ShoppingCart size={18} />
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Right: Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header: Search & Profile */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 z-20 shadow-sm relative">
          {/* Top Row: Search Bar & Profile */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl min-w-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama produk atau scan barcode..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:bg-white shadow-inner"
                />
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative shrink-0 self-start sm:self-auto">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-white shadow-inner">{userName?.substring(0, 2).toUpperCase() || 'AD'}</div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-text-primary leading-tight">{userName}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{userRole}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 hidden sm:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-14 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-40 animate-scale-in">
                    <div className="px-4 py-3 border-b border-slate-100 mb-1">
                      <p className="text-sm font-bold text-text-primary">{userName}</p>
                      <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">{userRole}</p>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Store size={12} className="text-primary" />
                        <span>{userRole === 'ADMIN' ? 'Semua Cabang (Pusat)' : 'Cabang Depok'}</span>
                      </div>
                    </div>

                    {userRole === 'ADMIN' && (
                      <>
                        <Link href="/users" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-colors">
                          <Users size={16} /> Tambah Akun
                        </Link>
                        <div className="mx-4 my-1 border-t border-slate-100" />
                      </>
                    )}

                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                      <LogOut size={16} /> Keluar Aplikasi
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Row: Categories Tab */}
          <div className="px-6 pb-4 flex gap-2.5 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95
                  ${selectedCategory === cat ? 'bg-primary text-white shadow-[0_4px_12px_rgba(255,140,0,0.25)]' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center">
                <p className="text-slate-500 font-medium">Produk tidak ditemukan</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(255,140,0,0.12)] text-left group cursor-pointer active:scale-[0.98] transition-all duration-300 flex flex-col"
                >
                  <div className="w-full h-32 rounded-xl bg-slate-50/50 border border-slate-100 overflow-hidden relative mb-4 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-3 group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-3 flex-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-center w-full pt-3 border-t border-slate-100">
                    <span className="text-base font-black text-primary tracking-tight">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${
                        getAvailableStock(product) <= 0 ? 'bg-red-100 text-red-600' : getAvailableStock(product) <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      Stok: {getAvailableStock(product)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ===== PAYMENT MODAL ===== */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[460px] animate-scale-in overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-orange-50/20 to-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Pilih Metode Pembayaran</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Total Tagihan: <span className="font-extrabold text-primary text-sm ml-1">Rp {Math.round(total).toLocaleString('id-ID')}</span>
                </p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-7 space-y-6">
              {/* Payment Method Tabs */}
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { id: 'Tunai', label: 'Tunai (Cash)', desc: 'Uang Fisik', icon: Banknote },
                  { id: 'QRIS', label: 'QRIS Midtrans', desc: 'E-Wallet / Qris', icon: QrCode },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPaymentMethod(item.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                      paymentMethod === item.id
                        ? 'border-primary bg-orange-50/40 shadow-md shadow-primary/10 scale-[1.02]'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        paymentMethod === item.id ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <item.icon size={22} />
                      </div>
                      {paymentMethod === item.id && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-extrabold ${paymentMethod === item.id ? 'text-primary' : 'text-slate-800'}`}>{item.label}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Cash input for Tunai */}
              {paymentMethod === 'Tunai' && (
                <div className="pt-1 space-y-4 animate-fade-in">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Uang Diterima (Rp)</label>
                      {cashInput > 0 && (
                        <button onClick={() => setCashInput(0)} className="text-[11px] font-bold text-primary hover:underline cursor-pointer">
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">Rp</span>
                      <input
                        type="number"
                        value={cashInput || ''}
                        min={Math.round(total)}
                        onChange={(e) => setCashInput(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xl font-black text-right tracking-tight text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Dynamic Smart Cash Presets */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pilihan Nominal Cepat</p>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => setCashInput(Math.round(total))}
                        className={`py-2.5 px-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          cashInput === Math.round(total)
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-slate-100/80 hover:bg-primary/10 hover:text-primary text-slate-700 border-slate-200'
                        }`}
                      >
                        Uang Pas
                      </button>
                      {Array.from(new Set([
                        Math.ceil(total / 10000) * 10000,
                        Math.ceil(total / 50000) * 50000,
                        100000,
                      ]))
                        .filter((amt) => amt >= total)
                        .slice(0, 3)
                        .map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setCashInput(amt)}
                            className={`py-2.5 px-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                              cashInput === amt
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-slate-100/80 hover:bg-primary/10 hover:text-primary text-slate-700 border-slate-200'
                            }`}
                          >
                            Rp {(amt / 1000).toFixed(0)}k
                          </button>
                        ))}
                    </div>
                  </div>

                  {cashInput >= total ? (
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex justify-between items-center animate-fade-in shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Banknote size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider">Kembalian</p>
                          <p className="text-xs text-emerald-600 font-medium">Uang tunai pelanggan lebih</p>
                        </div>
                      </div>
                      <span className="text-xl font-black text-emerald-700">Rp {Math.round(cashInput - total).toLocaleString('id-ID')}</span>
                    </div>
                  ) : (
                    cashInput > 0 && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-600 font-bold flex items-center justify-center gap-1.5">
                        <span>⚠️ Uang kurang Rp {Math.round(total - cashInput).toLocaleString('id-ID')}</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* QRIS Midtrans notice */}
              {paymentMethod === 'QRIS' && (
                <div className="p-5 bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-blue-50/40 border border-orange-100/80 rounded-2xl text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center mx-auto">
                    <QrCode size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Midtrans QRIS Sandbox Gateway</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                      Sistem akan membuat QR Code QRIS dinamis berstandar Midtrans Sandbox secara real-time.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full text-[10px] font-mono font-bold text-slate-700 border border-slate-200 shadow-sm">
                    <ShieldCheck size={12} className="text-primary" />
                    <span>Dukungan GoPay, OVO, Dana, LinkAja & Bank BCA/Mandiri</span>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button onClick={() => setIsPayModalOpen(false)} className="pro-button-secondary flex-1 py-3.5 text-sm font-bold cursor-pointer">
                  Batal
                </button>
                {paymentMethod === 'Tunai' ? (
                  <button
                    onClick={() => handleConfirmPayment('Tunai')}
                    disabled={cashInput < total}
                    className="pro-button-primary flex-1 py-3.5 text-sm font-extrabold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    Konfirmasi Bayar
                  </button>
                ) : (
                  <button
                    onClick={handleStartMidtransQris}
                    className="pro-button-primary flex-1 py-3.5 text-sm font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lanjut QRIS Midtrans</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MIDTRANS SANDBOX QRIS SIMULATOR MODAL ===== */}
      {isMidtransModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 text-slate-900 w-full max-w-[460px] animate-scale-in overflow-hidden flex flex-col relative my-6">
            {/* Header - Solid & Clean Design */}
            <div className="px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-orange-50/20 to-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">QRIS Midtrans</h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Order ID: <span className="font-extrabold text-slate-900 ml-1">{midtransOrderId}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-950 bg-amber-400 px-3 py-1.5 rounded-xl border border-amber-500 shadow-sm">
                  <Clock size={13} className="text-slate-950" />
                  <span className="font-mono">{formatTimer(midtransTimer)}</span>
                </div>
                <button
                  onClick={() => setIsMidtransModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content Body - Identical p-7 padding & space-y-5 */}
            <div className="p-7 space-y-5">
              {/* Authentic QRIS Card Display */}
              <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-md border border-slate-200/80 text-center space-y-4 relative overflow-hidden">
                {/* QRIS Top Banner */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl tracking-tighter text-red-600 italic">QRIS</span>
                    <span className="text-[10px] text-slate-400 font-sans leading-none text-left font-bold border-l border-slate-200 pl-2">
                      National<br />Standard
                    </span>
                  </div>
                  <span className="text-xs font-black tracking-widest bg-slate-900 px-2.5 py-1 rounded-lg text-white">GPN</span>
                </div>

                <div className="py-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">ZEN POS STORE</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">Rp {Math.round(total).toLocaleString('id-ID')}</p>
                </div>

                {/* QR Code Graphic */}
                <div className="relative w-52 h-52 mx-auto bg-white p-2.5 rounded-2xl border-2 border-slate-100 shadow-inner flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Position Detection Patterns */}
                    <rect x="5" y="5" width="25" height="25" fill="#0f172a" rx="3" />
                    <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
                    <rect x="13" y="13" width="9" height="9" fill="#0f172a" rx="1.5" />

                    <rect x="70" y="5" width="25" height="25" fill="#0f172a" rx="3" />
                    <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
                    <rect x="78" y="13" width="9" height="9" fill="#0f172a" rx="1.5" />

                    <rect x="5" y="70" width="25" height="25" fill="#0f172a" rx="3" />
                    <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
                    <rect x="13" y="78" width="9" height="9" fill="#0f172a" rx="1.5" />

                    {/* Simulated Data Modules */}
                    <path fillRule="evenodd" clipRule="evenodd" d="M35 5h5v5h-5V5zm10 0h15v5H45V5zm20 0h5v5h-5V5zM35 15h10v5H35v-5zm15 0h10v5H50v-5zm0 10h5v5h-5v-5zm10 0h5v5h-5v-5zM5 35h5v10H5V35zm10 0h5v5h-5v-5zm10 0h10v5H25v-5zm15 0h5v15h-5V35zm10 0h15v5H50v-5zm20 0h10v5H70v-5zm15 0h10v10H85V35zM5 50h10v5H5v-5zm20 0h5v10H25V50zm15 0h10v5H40v-5zm15 0h10v10H55V50zm20 0h10v5H75v-5zm10 0h10v5H85v-5zM5 60h5v5H5v-5zm15 0h5v5h-5v-5zm15 0h5v5h-5v-5zm15 0h10v5H50v-5zm20 0h5v5h-5v-5zm10 0h10v5H80v-5zM35 70h5v5h-5v-5zm10 0h10v5H45v-5zm20 0h10v10H65V70zm15 0h10v5H80v-5zM35 80h10v5H35v-5zm15 0h5v15h-5V80zm20 0h10v5H70v-5zm15 0h5v5h-5v-5zM35 90h5v5h-5v-5zm15 0h5v5h-5v-5zm20 0h15v5H70v-5z" fill="#0f172a" />
                  </svg>

                  {/* Center Midtrans Logo Watermark */}
                  <div className="absolute inset-0 m-auto w-11 h-11 bg-white rounded-xl shadow-lg border border-slate-200 flex items-center justify-center p-1">
                    <span className="font-black text-[11px] text-blue-600 tracking-tighter">midtrans</span>
                  </div>

                  {midtransStatus === 'settlement' && (
                    <div className="absolute inset-0 bg-emerald-600 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white animate-scale-in">
                      <CheckCircle2 size={52} className="text-white mb-1.5 animate-bounce" />
                      <span className="font-black text-base uppercase tracking-wider">SETTLEMENT</span>
                      <span className="text-xs opacity-90 font-bold">Pembayaran Berhasil!</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-500 font-bold tracking-wide">
                  <span>NMID: ID1020249857102</span>
                </div>
              </div>

              {/* Status Indicator Banner - SOLID COLORS */}
              <div className="text-center">
                {midtransStatus === 'pending' && (
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-md border border-amber-500">
                    <RefreshCw size={14} className="animate-spin text-slate-950" />
                    <span>STATUS: PENDING (Menunggu Pembayaran)</span>
                  </div>
                )}
                {midtransStatus === 'settlement' && (
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md">
                    <CheckCircle2 size={15} />
                    <span>STATUS: SETTLEMENT (Pembayaran Berhasil)</span>
                  </div>
                )}
                {midtransStatus === 'expire' && (
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md">
                    <span>STATUS: EXPIRED (Waktu Pembayaran Habis)</span>
                  </div>
                )}
              </div>

              {/* Midtrans Sandbox Action Panel */}
              <div className="bg-slate-100/90 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-blue-600" />
                    SIMULATOR MIDTRANS
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-slate-900 text-white tracking-wider uppercase">
                    TESTING MODE
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleSimulateMidtransSuccess}
                    disabled={midtransStatus !== 'pending' || isSimulatingSuccess}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                  >
                    {isSimulatingSuccess ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Mengirim Webhook Midtrans...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Simulasikan Pembayaran Sukses (Webhook)</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => window.open('https://simulator.sandbox.midtrans.com/qris/index', '_blank')}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink size={13} />
                      <span>Midtrans Simulator</span>
                    </button>

                    <button
                      onClick={() => {
                        const payload = `00020101021226680016ID.CO.QRIS.WWW01189360091800000000000215ID10202498571020303UME51440014ID.MIDTRANS.WWW0215${midtransOrderId}5204581253033605802ID5913ZEN POS STORE6007JAKARTA61051211062070703A016304`;
                        navigator.clipboard.writeText(payload);
                        setCopiedPayload(true);
                        setTimeout(() => setCopiedPayload(false), 2000);
                      }}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedPayload ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedPayload ? 'Tersalin!' : 'Copy Payload'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button - Matching pro-button-secondary style */}
              <button
                onClick={() => setIsMidtransModalOpen(false)}
                className="pro-button-secondary w-full py-3.5 text-sm font-bold cursor-pointer"
              >
                Batalkan & Kembali ke POS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RECEIPT MODAL ===== */}
      {isReceiptModalOpen && lastTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm animate-scale-in flex flex-col relative rounded-t-xl" style={{ filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))' }}>
            <div className="p-6 text-center border-b border-dashed border-slate-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Receipt size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest">Pembayaran Berhasil</h2>
              <p className="text-sm text-slate-500 font-mono mt-1 w-full text-center">ID: {lastTransaction.id}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh] bg-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">ZEN POS</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Modern Multi-Location POS</p>
                <div className="h-px bg-slate-100 my-4 mx-auto w-3/4" />
                <p className="text-xs text-slate-500 font-mono">{lastTransaction.date}</p>
              </div>

              <div className="space-y-3">
                {lastTransaction.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm font-mono items-start">
                    <div className="flex-1 pr-4">
                      <p className="text-slate-800 font-semibold">{item.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <span className="text-slate-800 font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 pt-4 mt-2 space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-800">Rp {(lastTransaction.total / 1.11).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-slate-600">PPN (11%)</span>
                  <span className="text-slate-800">Rp {(lastTransaction.total - lastTransaction.total / 1.11).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-base font-bold font-mono pt-3 mt-2 border-t border-dashed border-slate-300">
                  <span className="text-slate-800">TOTAL</span>
                  <span className="text-slate-800">Rp {Math.round(lastTransaction.total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs font-mono pt-1 text-slate-500 uppercase">
                  <span>Metode Bayar</span>
                  <span className="font-bold text-slate-800">{lastTransaction.paymentMethod}</span>
                </div>
              </div>

              <div className="text-center pt-8 pb-2">
                <p className="text-xs font-mono text-slate-500 italic">Terima kasih atas kunjungan Anda</p>
                <p className="text-[10px] font-mono text-slate-400 font-bold mt-2">SIMPAN STRUK INI SEBAGAI BUKTI</p>
              </div>
            </div>

            {/* ZigZag Bottom Edge */}
            <div
              className="relative h-3 w-full"
              style={{ background: 'linear-gradient(-45deg, transparent 8px, #ffffff 0), linear-gradient(45deg, transparent 8px, #ffffff 0)', backgroundPosition: 'left bottom', backgroundRepeat: 'repeat-x', backgroundSize: '16px 16px' }}
            ></div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center">
            <button onClick={() => setIsReceiptModalOpen(false)} className="w-full max-w-sm bg-slate-800 hover:bg-slate-900 text-white font-mono font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
              TUTUP & TRANSAKSI BARU
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
