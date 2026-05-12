'use client';

import { DollarSign, ShoppingBag, TrendingUp, Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Laporan</h1>
        <button className="neo-button-primary flex items-center gap-2 bg-black text-[#EED9B9] hover:bg-[#5E0006]">
          <Download size={20} className="stroke-[3px]" /> DOWNLOAD PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="neo-card p-6 flex flex-col justify-between hover:bg-[#EED9B9] transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black uppercase text-black/60 tracking-tight">Total Pendapatan (Bulan Ini)</h3>
            <div className="p-2 border-[3px] border-black bg-[#A8E6CF] shadow-[2px_2px_0px_0px_#000]">
              <DollarSign size={24} className="stroke-[3px] text-black" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tighter text-black">Rp 45.200.000</p>
        </div>

        <div className="neo-card p-6 flex flex-col justify-between hover:bg-[#EED9B9] transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black uppercase text-black/60 tracking-tight">Total Transaksi (Bulan Ini)</h3>
            <div className="p-2 border-[3px] border-black bg-[#FFD3B6] shadow-[2px_2px_0px_0px_#000]">
              <ShoppingBag size={24} className="stroke-[3px] text-black" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tighter text-black">1.432 Order</p>
        </div>

        <div className="neo-card p-6 flex flex-col justify-between hover:bg-[#EED9B9] transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black uppercase text-black/60 tracking-tight">Produk Terlaris</h3>
            <div className="p-2 border-[3px] border-black bg-[#FF8B94] shadow-[2px_2px_0px_0px_#000]">
              <TrendingUp size={24} className="stroke-[3px] text-black" />
            </div>
          </div>
          <p className="text-xl font-black tracking-tighter text-black uppercase">Kopi Kenangan Mantan</p>
        </div>
      </div>

      <div className="border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden mt-8">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#D53E0F] text-white uppercase font-black text-sm">
            <tr>
              <th className="p-4 border-b-[4px] border-black">Penjualan 7 Hari Terakhir</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-24 text-center font-black uppercase text-2xl text-black/20">[ GRAFIK PENJUALAN ]</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
