'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const mockMutations = [
  { id: 'MUT-001', date: '2026-05-12', product: 'Kopi Kenangan Mantan', qty: 10, from: 'Gudang Pusat', to: 'Cabang Sudirman', status: 'Selesai' },
  { id: 'MUT-002', date: '2026-05-11', product: 'Roti Coklat', qty: 5, from: 'Gudang Pusat', to: 'Cabang Thamrin', status: 'Proses' },
  { id: 'MUT-003', date: '2026-05-10', product: 'Keripik Kentang', qty: 20, from: 'Cabang Sudirman', to: 'Cabang Thamrin', status: 'Selesai' },
];

export default function MutationsPage() {
  const [search, setSearch] = useState('');

  const filtered = mockMutations.filter((m) => m.product.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Mutasi Stok</h1>
        <button className="neo-button-primary">+ BUAT MUTASI</button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-black stroke-[3px]" size={20} />
          <input
            type="text"
            placeholder="CARI ID MUTASI / NAMA PRODUK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-[3px] border-black bg-white focus:outline-none focus:bg-[#EED9B9] shadow-[4px_4px_0px_0px_#000] font-black uppercase text-sm placeholder:text-black/50 transition-all rounded-xl"
          />
        </div>
        <select className="border-[3px] border-black px-4 py-3 font-black uppercase bg-white shadow-[4px_4px_0px_0px_#000] outline-none cursor-pointer focus:bg-[#EED9B9] transition-colors rounded-xl">
          <option>SEMUA STATUS</option>
          <option>PROSES</option>
          <option>SELESAI</option>
        </select>
      </div>

      <div className="border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-[#EED9B9] uppercase font-black text-sm">
            <tr>
              <th className="p-4 border-b-[4px] border-black">ID & Tanggal</th>
              <th className="p-4 border-b-[4px] border-black">Produk & Qty</th>
              <th className="p-4 border-b-[4px] border-black border-l-[4px]">Alur Mutasi</th>
              <th className="p-4 border-b-[4px] border-black border-l-[4px] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((mut) => (
              <tr key={mut.id} className="hover:bg-[#EED9B9] transition-colors border-b-[2px] border-black last:border-b-0 group">
                <td className="p-4">
                  <div className="font-black text-lg">{mut.id}</div>
                  <div className="text-sm font-bold text-black/70">{mut.date}</div>
                </td>
                <td className="p-4 text-sm font-bold uppercase tracking-tight">
                  <span className="bg-white border-[2px] border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000] mr-3">{mut.qty} PCS</span>
                  {mut.product}
                </td>
                <td className="p-4 font-black uppercase border-l-[2px] border-black text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-[#EED9B9] px-2 py-1">{mut.from}</span>
                    <ArrowRight size={16} className="stroke-[3px]" />
                    <span className="bg-[#D53E0F] text-white px-2 py-1">{mut.to}</span>
                  </div>
                </td>
                <td className="p-4 border-l-[2px] border-black text-center">
                  <span className={`px-3 py-1 font-black text-sm uppercase border-[2px] border-black shadow-[2px_2px_0px_0px_#000] ${mut.status === 'Selesai' ? 'bg-[#A8E6CF] text-black' : 'bg-[#FFD3B6] text-black'}`}>{mut.status}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center font-black uppercase text-xl text-black/50">
                  Tidak ada mutasi ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
