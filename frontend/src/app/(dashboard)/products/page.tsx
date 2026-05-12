'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const mockProducts = [
  { id: 1, sku: 'KPM01', name: 'Kopi Kenangan Mantan', category: 'MINUMAN', price: 24000, stock: 12 },
  { id: 2, sku: 'RC01', name: 'Roti Coklat', category: 'MAKANAN', price: 15000, stock: 8 },
  { id: 3, sku: 'ET01', name: 'Es Teh Tarik', category: 'MINUMAN', price: 10000, stock: 25 },
  { id: 4, sku: 'MG01', name: 'Mie Goreng Spesial', category: 'MAKANAN', price: 22000, stock: 5 },
  { id: 5, sku: 'AM01', name: 'Air Mineral 600ml', category: 'MINUMAN', price: 5000, stock: 50 },
];

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const userRole = localStorage.getItem('pos_role');
    setRole(userRole || '');
  }, []);

  const filtered = mockProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  if (role && role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <div className="p-6 bg-[#5644FF] text-white border-[4px] border-black shadow-[6px_6px_0px_0px_#000] mb-6 inline-block">
          <Lock size={64} className="stroke-[3px]" />
        </div>
        <h1 className="text-4xl font-black uppercase text-black">Akses Ditolak</h1>
        <p className="text-xl font-bold uppercase mt-2">Hanya Admin yang dapat mengelola Produk Master.</p>
        <button onClick={() => router.push('/')} className="neo-button-primary mt-8">
          KEMBALI KE DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Produk Master</h1>
        <button className="neo-button-primary">+ TAMBAH PRODUK</button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-black stroke-[3px]" size={20} />
          <input
            type="text"
            placeholder="CARI NAMA / SKU PRODUK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-[3px] border-black bg-white focus:outline-none focus:bg-[#FFC107] shadow-[4px_4px_0px_0px_#000] font-black uppercase text-sm placeholder:text-black/50 transition-all rounded-xl"
          />
        </div>
        <select className="border-[3px] border-black px-4 py-3 font-black uppercase bg-white shadow-[4px_4px_0px_0px_#000] outline-none cursor-pointer focus:bg-[#FFC107] transition-colors rounded-xl">
          <option>SEMUA KATEGORI</option>
          <option>MAKANAN</option>
          <option>MINUMAN</option>
        </select>
      </div>

      <div className="border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-white uppercase font-black text-sm">
            <tr>
              <th className="p-4 border-b-[4px] border-black">SKU</th>
              <th className="p-4 border-b-[4px] border-black">Nama Produk</th>
              <th className="p-4 border-b-[4px] border-black">Kategori</th>
              <th className="p-4 border-b-[4px] border-black border-l-[4px]">Harga</th>
              <th className="p-4 border-b-[4px] border-black border-l-[4px]">Stok Global</th>
              <th className="p-4 border-b-[4px] border-black border-l-[4px] text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-[#FFC107] transition-colors border-b-[2px] border-black last:border-b-0 group">
                <td className="p-4 font-bold text-sm bg-black/5 group-hover:bg-transparent">{prod.sku}</td>
                <td className="p-4 font-black uppercase tracking-tight">{prod.name}</td>
                <td className="p-4 font-bold text-sm uppercase">{prod.category}</td>
                <td className="p-4 font-black text-[#5644FF] border-l-[2px] border-black">Rp {prod.price.toLocaleString('id-ID')}</td>
                <td className="p-4 font-black border-l-[2px] border-black text-lg">{prod.stock}</td>
                <td className="p-4 border-l-[2px] border-black">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 border-[2px] border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-xl">
                      <Edit size={16} className="stroke-[3px]" />
                    </button>
                    <button className="p-2 border-[2px] border-black bg-white hover:bg-[#5644FF] hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-xl">
                      <Trash2 size={16} className="stroke-[3px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center font-black uppercase text-xl text-black/50">
                  Tidak ada produk ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
