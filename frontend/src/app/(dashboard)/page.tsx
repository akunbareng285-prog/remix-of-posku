'use client';

import Link from 'next/link';
import { 
  TrendingUp, ShoppingBag, AlertTriangle, ArrowUpRight, 
  Plus, Sparkles, Store, Building2, Target, History,
  ArrowUp, Clock, CheckCircle2, PackageOpen,
  Coffee, UtensilsCrossed, CupSoda, Soup, Droplets
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardHome() {
  const [role, setRole] = useState<string>('');
  const [stats, setStats] = useState({
    todaySales: 0,
    totalTransactions: 0,
    lowStockCount: 0,
    latestActivities: [] as any[],
    topProducts: [] as any[]
  });

  useEffect(() => {
    const savedRole = localStorage.getItem('pos_role');
    setRole(savedRole || '');

    // 1. Get Products for Low Stock
    const products = JSON.parse(localStorage.getItem('pos_products') || '[]');
    const lowStock = products.filter((p: any) => p.stock <= 10).length;

    // 2. Get Transactions for Sales & Top Products
    const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
    const today = new Date().toLocaleDateString('id-ID');
    
    const todayTrans = transactions.filter((t: any) => t.date.includes(today.split(' ')[0])); // Simple today check
    const todaySalesTotal = todayTrans.reduce((sum: number, t: any) => sum + t.total, 0);

    // 3. Top Products calculation
    const productSales: Record<string, { count: number; category: string }> = {};
    transactions.forEach((t: any) => {
      t.items.forEach((item: any) => {
        if (!productSales[item.name]) {
          productSales[item.name] = { count: 0, category: item.category };
        }
        productSales[item.name].count += item.quantity;
      });
    });

    const topProds = Object.entries(productSales)
      .map(([name, data]) => ({ name, sales: data.count, category: data.category }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // 4. Latest Activities from Mutations
    const mutations = JSON.parse(localStorage.getItem('pos_mutations') || '[]');
    const latest = mutations.slice(0, 4).map((m: any) => ({
      text: m.type === 'sale' ? `Penjualan: ${m.product} (${m.qty})` : m.text,
      time: 'Baru saja',
      type: m.type
    }));

    setStats({
      todaySales: todaySalesTotal,
      totalTransactions: todayTrans.length,
      lowStockCount: lowStock,
      latestActivities: latest,
      topProducts: topProds
    });
  }, []);

  const isAdmin = role === 'ADMIN';
  return (
    <div className="space-y-8 relative z-10">
      {/* Page Header (Moved above columns for alignment) */}
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Dashboard {isAdmin ? 'Pusat' : 'Cabang Depok'}
        </h1>
        <p className="text-sm text-text-secondary mt-1 font-medium">
          {isAdmin ? 'Ringkasan performa bisnis dari seluruh cabang hari ini' : 'Ringkasan aktivitas dan performa toko hari ini'}
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-stretch">
        {/* Kolom Kiri - Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {/* Card 1: Penjualan */}
          <div className="pro-stat-card before:bg-orange-500 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="text-[13px] font-black text-text-secondary uppercase tracking-widest opacity-80">Penjualan Hari Ini</span>
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:rotate-12 transition-all duration-500">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black text-text-primary tracking-tighter">Rp {stats.todaySales.toLocaleString('id-ID')}</p>
              <div className="flex items-center gap-2 mt-5">
                <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-orange-600 text-[11px] font-black flex items-center gap-1 border border-orange-100/50">
                  <ArrowUpRight size={14} /> +12.5%
                </span>
                <span className="text-[11px] text-text-muted font-bold">vs kemarin</span>
              </div>
            </div>
          </div>

          {/* Card 2: Transaksi */}
          <div className="pro-stat-card before:bg-amber-500 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="text-[13px] font-black text-text-secondary uppercase tracking-widest opacity-80">Total Transaksi</span>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:rotate-12 transition-all duration-500">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-text-primary tracking-tighter">{stats.totalTransactions}</p>
                <span className="text-sm font-black text-text-muted uppercase tracking-widest opacity-60">transaksi</span>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-600 text-[11px] font-black flex items-center gap-1 border border-amber-100/50">
                  <ArrowUpRight size={14} /> +5.2%
                </span>
                <span className="text-[11px] text-text-muted font-bold">vs kemarin</span>
              </div>
            </div>
          </div>

          {/* Card 3: Stok Menipis */}
          <div className="pro-stat-card before:bg-rose-500 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="text-[13px] font-black text-text-secondary uppercase tracking-widest opacity-80">Peringatan Stok</span>
              <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:rotate-12 transition-all duration-500">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-text-primary tracking-tighter">{stats.lowStockCount}</p>
                <span className="text-sm font-black text-text-muted uppercase tracking-widest opacity-60">produk tipis</span>
              </div>
              <div className="mt-5">
                <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-wider border border-rose-100/50 animate-pulse">
                  Perlu restock segera
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch flex-1">
          {/* Aktivitas Terbaru (Dipindahkan dari Sidebar) */}
          <div className="pro-card h-full flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-text-primary flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <History size={20} />
                </div>
                Aktivitas Terbaru
              </h2>
            </div>
            <div className="space-y-8 flex-1">
              {stats.latestActivities.length > 0 ? stats.latestActivities.map((activity, i) => {
                const isStock = activity.type === 'stock';
                const Icon = isStock ? PackageOpen : (activity.type === 'sale' ? CheckCircle2 : Clock);
                const color = isStock ? 'text-amber-500' : (activity.type === 'sale' ? 'text-orange-500' : 'text-slate-500');
                const bg = isStock ? 'bg-amber-50' : (activity.type === 'sale' ? 'bg-orange-50' : 'bg-slate-50');
                
                return (
                  <div key={i} className="flex gap-5 relative group">
                    {i !== stats.latestActivities.length - 1 && <div className="absolute left-[23px] top-12 bottom-[-32px] w-0.5 bg-slate-100/80"></div>}
                    <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shrink-0 shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300 border border-white`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[15px] font-bold text-text-primary leading-snug group-hover:text-primary transition-colors cursor-default">{activity.text}</p>
                      <p className="text-[11px] text-text-muted font-black mt-1.5 uppercase tracking-widest opacity-70">{activity.time}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <History size={32} className="text-slate-200 mb-2" />
                  <p className="text-sm text-text-muted">Belum ada aktivitas hari ini</p>
                </div>
              )}
            </div>
            <button className="w-full mt-10 py-3.5 rounded-2xl border border-slate-100 text-[11px] font-black text-text-secondary uppercase tracking-widest hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all active:scale-95">
              Lihat Semua Aktivitas
            </button>
          </div>

          {/* Produk Terlaris (List) */}
          <div className="pro-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-text-primary flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <ShoppingBag size={20} />
                </div>
                Produk Terlaris
              </h2>
            </div>
            <div className="space-y-4 flex-1">
              {stats.topProducts.length > 0 ? stats.topProducts.map((item, i) => {
                const Icon = item.category === 'MINUMAN' ? Coffee : (item.category === 'MAKANAN' ? UtensilsCrossed : ShoppingBag);
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/40 border border-slate-100/50 hover:border-orange-200 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm">
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-text-primary group-hover:text-orange-600 transition-colors">{item.name}</p>
                        <p className="text-[11px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-60">{item.sales} unit terjual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black text-orange-500 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-50 uppercase tracking-tighter`}>HOT</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingBag size={32} className="text-slate-200 mb-2" />
                  <p className="text-sm text-text-muted">Belum ada data penjualan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan - Sidebar Content */}
      <div className="w-full xl:w-[380px] flex flex-col gap-8">
        {/* Pencapaian Target (New) */}
        <div className="pro-card relative overflow-hidden bg-gradient-to-br from-white to-orange-50/30">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Target size={180} />
          </div>
          <div className="relative z-10">
            <h3 className="text-[13px] font-black text-text-muted uppercase tracking-[0.2em] mb-8 opacity-70">Target Penjualan Bulanan</h3>
            <div className="flex items-center justify-center py-10">
              <div className="relative w-48 h-48">
                {/* Simple SVG Circular Progress */}
                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-sm">
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="14"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={527}
                    strokeDashoffset={527 - (527 * 72) / 100}
                    strokeLinecap="round"
                    className="text-orange-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-text-primary tracking-tighter">72%</span>
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-60">Tercapai</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-6 bg-white/50 p-6 rounded-3xl border border-white">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-text-secondary font-bold">Terkumpul:</span>
                <span className="font-black text-orange-600">Rp 108.000.000</span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[72%]"></div>
              </div>
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-text-secondary font-bold">Sisa Target:</span>
                <span className="font-black text-text-primary">Rp 42.000.000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performa Cabang (Hanya Admin) */}
        {isAdmin && (
          <div className="pro-card flex-1">
            <h2 className="text-xl font-black text-text-primary flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Building2 size={20} />
              </div>
              Performa Cabang
            </h2>
            <div className="space-y-5">
              {[
                { name: 'Pusat (Jakarta)', id: 'JKT01', sales: 'Rp 8.6jt', pct: 86, color: 'bg-orange-500' },
                { name: 'Cabang Depok', id: 'DEP01', sales: 'Rp 4.2jt', pct: 42, color: 'bg-amber-500' },
                { name: 'Cabang Bekasi', id: 'BKS01', sales: 'Rp 0', pct: 0, color: 'bg-slate-200' },
              ].map((branch, i) => (
                <div key={i} className="p-5 rounded-3xl border border-slate-100/60 bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[15px] font-black text-text-primary">{branch.name}</p>
                      <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1 opacity-60">{branch.id}</p>
                    </div>
                    <p className="text-[15px] font-black text-orange-600">{branch.sales}</p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${branch.color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(249,115,22,0.3)]`} style={{ width: `${branch.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
