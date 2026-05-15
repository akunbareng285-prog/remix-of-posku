'use client';

import { DollarSign, ShoppingBag, TrendingUp, Download, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Laporan</h1>
          <p className="text-sm text-text-muted mt-1">Ringkasan performa bisnis Anda</p>
        </div>
        <button className="pro-button-secondary">
          <Download size={16} /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="pro-stat-card before:bg-orange-500 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-[13px] font-black text-text-secondary uppercase tracking-widest opacity-80">Total Pendapatan</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-text-primary tracking-tighter">Rp 45.200.000</p>
          <p className="text-[11px] text-text-muted font-black mt-3 uppercase tracking-widest opacity-70">Bulan ini</p>
        </div>

        <div className="pro-stat-card before:bg-amber-500 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-[13px] font-black text-text-secondary uppercase tracking-widest opacity-80">Total Transaksi</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-text-primary tracking-tighter">1.432</p>
          <p className="text-[11px] text-text-muted font-black mt-3 uppercase tracking-widest opacity-70">Order bulan ini</p>
        </div>

        <div className="pro-stat-card before:bg-orange-600 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-[13px] font-black text-text-secondary uppercase tracking-widest opacity-80">Produk Terlaris</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
              <BarChart3 size={18} />
            </div>
          </div>
          <p className="text-xl font-black text-text-primary tracking-tight truncate">Kopi Kenangan Mantan</p>
          <p className="text-[11px] text-text-muted font-black mt-3 uppercase tracking-widest opacity-70">348 unit terjual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
        <div className="pro-card flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-text-primary">Penjualan 7 Hari Terakhir</h3>
              <p className="text-[11px] text-text-muted font-black uppercase tracking-widest mt-1 opacity-70">Tren penjualan harian</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="pro-select text-[11px] py-1.5 font-black uppercase tracking-widest">
                <option>7 Hari</option>
                <option>30 Hari</option>
                <option>3 Bulan</option>
              </select>
            </div>
          </div>

          <div className="h-96 mt-8 ml-8 relative flex items-end justify-between gap-3 px-2 flex-1">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[4, 3, 2, 1, 0].map((line) => (
                <div key={line} className="w-full border-t border-dashed border-slate-100 flex items-center h-0">
                  <span className="absolute -left-3 -translate-x-full text-[10px] text-slate-400 font-black opacity-60">
                    {line === 0 ? '0' : `${line * 10}jt`}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Bars */}
            {[
              { day: 'Sen', value: 45, label: 'Rp 18.5jt' },
              { day: 'Sel', value: 30, label: 'Rp 12.0jt' },
              { day: 'Rab', value: 65, label: 'Rp 26.5jt' },
              { day: 'Kam', value: 50, label: 'Rp 20.2jt' },
              { day: 'Jum', value: 85, label: 'Rp 34.0jt' },
              { day: 'Sab', value: 100, label: 'Rp 40.5jt' },
              { day: 'Min', value: 75, label: 'Rp 30.1jt' },
            ].map((bar, i) => (
              <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end pb-8 group z-10">
                <div className="w-full max-w-[40px] bg-orange-500/10 hover:bg-orange-500/20 transition-all duration-300 rounded-t-2xl relative cursor-pointer group-hover:scale-105" style={{ height: `${bar.value}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-orange-500 rounded-t-2xl transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" style={{ height: '100%' }}></div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-black py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl z-20">
                    {bar.label}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-[6px] border-transparent border-t-slate-800"></div>
                  </div>
                </div>
                <span className="absolute bottom-0 text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pro-card flex flex-col relative overflow-hidden">
          <h3 className="text-xl font-black text-text-primary mb-8">Rincian Produk Terlaris</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-text-muted uppercase tracking-[0.2em]">
                  <th className="pb-4 font-black pl-2 opacity-60">Nama Produk</th>
                  <th className="pb-4 font-black opacity-60">Kategori</th>
                  <th className="pb-4 font-black text-right opacity-60">Terjual</th>
                  <th className="pb-4 font-black text-right opacity-60">Pendapatan</th>
                  <th className="pb-4 font-black text-right pr-2 opacity-60">Kontribusi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Kopi Kenangan Mantan', cat: 'Minuman', qty: 348, rev: 'Rp 6.9jt', pct: 45 },
                  { name: 'Roti Bakar Coklat', cat: 'Makanan', qty: 156, rev: 'Rp 3.1jt', pct: 20 },
                  { name: 'Es Teh Manis', cat: 'Minuman', qty: 212, rev: 'Rp 1.0jt', pct: 15 },
                  { name: 'Indomie Telur Kornet', cat: 'Makanan', qty: 85, rev: 'Rp 1.7jt', pct: 10 },
                  { name: 'Nasi Goreng Spesial', cat: 'Makanan', qty: 64, rev: 'Rp 2.2jt', pct: 10 },
                  { name: 'Pisang Goreng Madu', cat: 'Cemilan', qty: 58, rev: 'Rp 1.2jt', pct: 8 },
                  { name: 'Thai Tea Large', cat: 'Minuman', qty: 42, rev: 'Rp 1.1jt', pct: 7 },
                  { name: 'Ayam Geprek Juara', cat: 'Makanan', qty: 35, rev: 'Rp 1.4jt', pct: 5 },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-orange-50/30 transition-all group">
                    <td className="py-4.5 pl-2 font-black text-text-primary group-hover:text-orange-600 transition-colors">{item.name}</td>
                    <td className="py-4.5 text-[11px] text-text-muted font-black uppercase tracking-widest opacity-60">{item.cat}</td>
                    <td className="py-4.5 text-right text-orange-600 font-black">{item.qty}</td>
                    <td className="py-4.5 text-right text-text-secondary font-bold text-xs">{item.rev}</td>
                    <td className="py-4.5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-[10px] font-black text-text-muted w-8">{item.pct}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]" style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
