'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, Minus, Trash2, LogOut, ShoppingCart, Receipt, Store, Users, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
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
  
  // Receipt state
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{ items: CartItem[]; total: number; date: string; id: string } | null>(null);

  const [categories, setCategories] = useState(['SEMUA', 'MAKANAN', 'MINUMAN', 'SNACK']);

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
    if (savedCategories) {
      setCategories(['SEMUA', ...JSON.parse(savedCategories)]);
    }
  }, [router]);

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

  const addToCart = (product: Product) => {
    // Check if stock is available
    const existingInCart = cart.find(item => item.id === product.id);
    const quantityInCart = existingInCart ? existingInCart.quantity : 0;
    
    if (product.stock <= quantityInCart) {
      alert(`Stok produk "${product.name}" habis!`);
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
    
    // 1. Prepare transaction data for receipt
    const transactionId = `TRX-${Date.now().toString().slice(-6)}`;
    const transactionDate = new Date().toLocaleString('id-ID');
    setLastTransaction({
      id: transactionId,
      date: transactionDate,
      items: [...cart],
      total: total
    });

    // 2. Update stock in localStorage
    const currentProducts: Product[] = JSON.parse(localStorage.getItem('pos_products') || '[]');
    const updatedProducts = currentProducts.map(p => {
      const cartItem = cart.find(item => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });

    localStorage.setItem('pos_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts); // Update local state for immediate feedback
    
    // 3. Open receipt modal
    setIsReceiptModalOpen(true);
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
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
            <p className="text-xs text-text-muted">Kasir: {userName} • {userRole === 'ADMIN' ? 'Pusat' : 'Cabang Depok'}</p>
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
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-card-border flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Minus size={12} className="text-text-secondary" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-text-primary">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-card-border flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Plus size={12} className="text-text-secondary" />
                  </button>
                </div>
                <div className="text-right shrink-0 ml-1">
                  <p className="text-sm font-semibold text-text-primary">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 rounded-lg text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-red-50 transition-all"
                >
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
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="pro-button-primary w-full py-3.5 text-base font-bold"
            >
              <ShoppingCart size={18} />
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Right: Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header: Search, Filter & Profile */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-card-border flex flex-col md:flex-row md:items-center justify-between gap-4 z-20 shadow-sm relative">
          
          {/* Search & Filter */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan barcode atau cari nama produk..."
                className="pro-input pl-10 py-2.5 text-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300
                    ${selectedCategory === cat
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                    }`}
                >
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative shrink-0 self-start md:self-center">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {userName?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-text-primary leading-tight">{userName}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{userRole}</p>
              </div>
              <ChevronDown size={16} className={`text-slate-400 hidden sm:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-14 w-56 bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-40 animate-scale-in">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                    <p className="text-sm font-bold text-text-primary">{userName}</p>
                    <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">{userRole}</p>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 bg-slate-100/80 p-2 rounded-lg border border-white shadow-inner">
                      <Store size={12} className="text-primary" />
                      <span>{userRole === 'ADMIN' ? 'Semua Cabang (Pusat)' : 'Cabang Depok'}</span>
                    </div>
                  </div>
                  
                  {userRole === 'ADMIN' && (
                    <>
                      <Link
                        href="/users"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Users size={16} /> Tambah Akun
                      </Link>
                      <div className="mx-4 my-1 border-t border-slate-100" />
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={16} /> Keluar Aplikasi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center">
                <p className="text-text-muted font-medium">Produk tidak ditemukan</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="pro-card-elevated text-left group cursor-pointer hover:border-primary/30 active:scale-[0.98] transition-all duration-200"
                >
                  <div className="h-28 rounded-xl bg-slate-50 overflow-hidden relative mb-3 group-hover:bg-primary/5 transition-colors">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-card-border">
                    <span className="text-base font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className="pro-badge-neutral text-[10px]">Stok: {product.stock}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ===== RECEIPT MODAL ===== */}
      {isReceiptModalOpen && lastTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in overflow-hidden flex flex-col">
            <div className="p-6 text-center border-b border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Receipt size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Pembayaran Berhasil</h2>
              <p className="text-sm text-text-muted mt-1">ID: {lastTransaction.id}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-text-primary tracking-tighter">ZEN POS</h3>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Modern Multi-Location POS</p>
                <div className="h-px bg-slate-100 my-4" />
                <p className="text-[10px] text-text-secondary font-mono">{lastTransaction.date}</p>
              </div>

              <div className="space-y-3">
                {lastTransaction.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs font-mono">
                    <div className="flex-1 pr-4">
                      <p className="text-text-primary font-bold">{item.name}</p>
                      <p className="text-text-muted">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <span className="text-text-primary font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text-primary">Rp {(lastTransaction.total / 1.11).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text-muted">PPN (11%)</span>
                  <span className="text-text-primary">Rp {(lastTransaction.total - lastTransaction.total / 1.11).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm font-bold font-mono pt-2 border-t border-slate-100">
                  <span className="text-text-primary">TOTAL</span>
                  <span className="text-primary text-base">Rp {Math.round(lastTransaction.total).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-center pt-6 pb-2">
                <p className="text-[10px] text-text-muted italic">Terima kasih atas kunjungan Anda</p>
                <p className="text-[10px] text-text-muted font-bold mt-1">SIMPAN STRUK INI SEBAGAI BUKTI</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex gap-3">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="pro-button-secondary flex-1"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsReceiptModalOpen(false);
                }}
                className="pro-button-primary flex-1"
              >
                Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
