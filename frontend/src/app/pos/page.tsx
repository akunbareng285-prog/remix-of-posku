'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, Minus, Trash2, LogOut } from 'lucide-react';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const initialProducts: Product[] = [
  { id: 1, sku: 'KPM01', name: 'Kopi Kenangan Mantan', price: 24000, stock: 12, category: 'MINUMAN' },
  { id: 2, sku: 'RC01', name: 'Roti Coklat', price: 15000, stock: 8, category: 'MAKANAN' },
  { id: 3, sku: 'ET01', name: 'Es Teh Tarik', price: 10000, stock: 25, category: 'MINUMAN' },
  { id: 4, sku: 'MG01', name: 'Mie Goreng Spesial', price: 22000, stock: 5, category: 'MAKANAN' },
  { id: 5, sku: 'AM01', name: 'Air Mineral 600ml', price: 5000, stock: 50, category: 'MINUMAN' },
  { id: 6, sku: 'KK01', name: 'Keripik Kentang', price: 12000, stock: 15, category: 'SNACK' },
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

  // Filter functionality
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'SEMUA' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart functionality
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
    alert(`Pembayaran sebesar Rp ${total.toLocaleString('id-ID')} berhasil diproses!`);
    setCart([]); // Clear cart after checkout
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sisi Kiri: Keranjang Belanja */}
      <div className="w-1/3 min-w-[350px] bg-white border-r-[4px] border-black flex flex-col z-10 shadow-[4px_0px_0px_0px_#000]">
        {/* Header Header */}
        <div className="p-4 border-b-[4px] border-black flex items-center gap-4 bg-white rounded-tl-xl">
          {userRole === 'KASIR' ? (
            <button onClick={handleLogout} className="neo-button-secondary py-1 px-3 !shadow-none !border-[2px] bg-black text-white hover:bg-[#5644FF] transition-colors rounded-xl" title="Logout">
              <LogOut size={20} className="stroke-[3px]" />
            </button>
          ) : (
            <Link href="/" className="neo-button-secondary py-1 px-3 !shadow-none !border-[2px] rounded-xl" title="Kembali ke Dashboard">
              <ArrowLeft size={20} className="stroke-[3px]" />
            </Link>
          )}
          <div>
            <h2 className="font-black text-black uppercase tracking-tighter text-xl">Transaksi</h2>
            <p className="text-xs font-bold text-black uppercase">Kasir: {userName} | Pusat</p>
          </div>
        </div>

        {/* List Keranjang */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-black/50">
              <p className="font-black uppercase text-xl">Keranjang Kosong</p>
              <p className="text-sm font-bold uppercase mt-2">Pilih produk di layar kanan</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="neo-card flex flex-col !p-2 bg-white relative group">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute -right-3 -top-3 bg-neo-primary text-white border-[3px] border-black p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none rounded-xl"
                >
                  <Trash2 size={16} className="stroke-[3px]" />
                </button>
                <div className="flex justify-between font-black text-black text-sm uppercase tracking-tight mb-2 pr-4">
                  <span className="line-clamp-1 mr-2">{item.name}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-black">Rp {item.price.toLocaleString('id-ID')}</span>
                  <div className="flex items-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 border-r-[2px] border-black hover:bg-neo-primary hover:text-white transition-colors">
                      <Minus size={16} className="stroke-[3px]" />
                    </button>
                    <span className="font-black text-sm w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 border-l-[2px] border-black hover:bg-neo-primary hover:text-white transition-colors">
                      <Plus size={16} className="stroke-[3px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ringkasan & Tombol Bayar */}
        <div className="border-t-[4px] border-black bg-white">
          <div className="p-4 space-y-2 text-sm font-bold uppercase tracking-tight border-b-[4px] border-black bg-white">
            <div className="flex justify-between text-black">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[#FF3366]">
              <span>Pajak (11%)</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#5644FF] text-white">
            <span className="font-black text-xl uppercase">Total</span>
            <span className="font-black text-2xl tracking-tighter">Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <div className="p-4 bg-white">
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-[#5644FF] text-white font-black py-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:active:shadow-[4px_4px_0px_0px_#000] disabled:active:translate-x-0 disabled:active:translate-y-0 transition-all text-xl uppercase tracking-widest cursor-pointer rounded-xl"
            >
              BAYAR SEKARANG
            </button>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Daftar Produk */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-6 pb-0">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-black stroke-[3px]" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SCAN BARCODE / KETIK NAMA PRODUK..."
              className="w-full pl-14 pr-4 py-3 border-[4px] border-black bg-white focus:outline-none focus:bg-[#FFC107] shadow-[6px_6px_0px_0px_#000] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-[4px] focus:translate-y-[4px] transition-all font-black uppercase text-lg placeholder:text-black/50 rounded-xl"
            />
          </div>

          <div className="flex gap-4 mt-6 overflow-x-auto pb-2 overflow-y-hidden">
            {['SEMUA', 'MAKANAN', 'MINUMAN', 'SNACK'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 font-black uppercase border-[3px] border-black whitespace-nowrap active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${selectedCategory === cat ? 'bg-black text-white shadow-[4px_4px_0px_0px_#5644FF]' : 'neo-button-secondary !shadow-[4px_4px_0px_0px_#000]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-10 text-center font-black uppercase text-xl text-black/50">Produk tidak ditemukan</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} onClick={() => addToCart(product)} className="neo-card group cursor-pointer hover:bg-white">
                  <div className="h-32 bg-white border-[3px] border-black flex items-center justify-center text-black font-black uppercase text-sm group-hover:bg-[#5644FF] group-hover:text-white transition-colors">
                    [{product.category}]
                  </div>
                  <h3 className="font-black mt-4 mb-2 text-black uppercase tracking-tight line-clamp-2 leading-tight flex-1 text-lg">{product.name}</h3>
                  <div className="mt-auto pt-4 border-t-[3px] border-black flex justify-between items-center">
                    <span className="font-black text-xl tracking-tighter text-[#5644FF]">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className="text-xs font-black text-black bg-white border-[2px] border-black px-2 py-1 uppercase">SISA: {product.stock}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
