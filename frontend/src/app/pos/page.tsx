'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, Minus, Trash2, LogOut, ShoppingCart, Receipt } from 'lucide-react';
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
  const [userName, setUserName] = useState<string>('Kasir');
  const [userRole, setUserRole] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('pos_role');
    const name = localStorage.getItem('pos_user_name');
    if (!role) {
      router.push('/login');
    } else {
      setUserRole(role);
      setUserName(name || role);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('pos_role');
    localStorage.removeItem('pos_user_name');
    router.push('/login');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('SEMUA');

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'SEMUA' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
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
    alert(`Pembayaran sebesar Rp ${Math.round(total).toLocaleString('id-ID')} berhasil diproses!`);
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['SEMUA', 'MAKANAN', 'MINUMAN', 'SNACK'];

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
            <p className="text-xs text-text-muted">Kasir: {userName} • Pusat</p>
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
        {/* Search & Filter */}
        <div className="px-6 py-4 bg-white border-b border-card-border">
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan barcode atau cari nama produk..."
              className="pro-input pl-10 py-3 text-base"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                  }`}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
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
    </div>
  );
}
