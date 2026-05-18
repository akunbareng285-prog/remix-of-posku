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
    totalRevenue: 0,
    totalTransactions: 0,
    todayTransactions: 0,
    lowStockCount: 0,
    stockInCount: 0,
    latestActivities: [] as any[],
    topProducts: [] as any[]
  });

  useEffect(() => {
    const savedRole = localStorage.getItem('pos_role');
    setRole(savedRole || '');

    // 1. Products + Stock Map for Low Stock
    const products: any[] = JSON.parse(localStorage.getItem('pos_products') || '[]');
    const stockMap: Record<string, number> = JSON.parse(localStorage.getItem('pos_stock_map') || '{}');
    const locations: any[] = JSON.parse(localStorage.getItem('pos_locations') || '[]');

    let lowStock = 0;
    if (Object.keys(stockMap).length > 0 && locations.length > 0) {
      // Use per-location stock
      products.forEach((p: any) => {
        const minS = p.minStock ?? 10;
        const hasLow = locations.some((l: any) => {
          const qty = stockMap[`${p.id}-${l.id}`] ?? 0;
          return qty > 0 && qty < minS;
        });
        if (hasLow) lowStock++;
      });
    } else {
      lowStock = products.filter((p: any) => p.stock <= (p.minStock ?? 10)).length;
    }

    // 2. Transactions
    const transactions: any[] = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayTrans = transactions.filter((t: any) => t.timestamp >= todayStart.getTime());
    const todaySalesTotal = todayTrans.reduce((s: number, t: any) => s + t.total, 0);
    const totalRevenue = transactions.reduce((s: number, t: any) => s + t.total, 0);

    // 3. Top Products
    const productSales: Record<string, { count: number; category: string }> = {};
    transactions.forEach((t: any) => {
      (t.items || []).forEach((item: any) => {
        if (!productSales[item.name]) productSales[item.name] = { count: 0, category: item.category };
        productSales[item.name].count += item.quantity;
      });
    });
    const topProds = Object.entries(productSales)
      .map(([name, d]) => ({ name, sales: d.count, category: d.category }))
      .sort((a, b) => b.sales - a.sales).slice(0, 5);

    // 4. Recent activities from mutations + stock-in
    const mutations: any[] = JSON.parse(localStorage.getItem('pos_mutations') || '[]');
    const stockIn: any[] = JSON.parse(localStorage.getItem('pos_stock_in') || '[]');
    const latest = [
      ...mutations.slice(0, 3).map((m: any) => ({ text: `Penjualan: ${m.product} ×${m.qty}`, time: m.date, type: 'sale' })),
      ...stockIn.slice(0, 2).map((s: any) => ({ text: `Barang Masuk: ${s.totalQty} item ke ${s.locationName}`, time: s.date, type: 'stock_in' })),
    ].slice(0, 5);

    setStats({
      todaySales: todaySalesTotal,
      totalRevenue,
      totalTransactions: transactions.length,
      todayTransactions: todayTrans.length,
      lowStockCount: lowStock,
      stockInCount: stockIn.length,
      latestActivities: latest,
      topProducts: topProds
    });
  }, []);

  const isAdmin = role === 'ADMIN';
  return (
    <div className="space-y-8 relative z-10">
      {/* Page Header (Moved above columns for alignment) */}
      <div className="mb-2">
        <h1 className="page-title">
          Dashboard <span className="text-primary">{isAdmin ? 'Pusat' : 'Cabang Depok'}</span>
        </h1>
        <p className="page-subtitle">
          {isAdmin ? 'Ringkasan performa bisnis dari seluruh cabang hari ini' : 'Ringkasan aktivitas dan performa toko hari ini'}
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-stretch">
        {/* Kolom Kiri - Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {/* Card 1: Penjualan */}
          <div className="pro-stat-card group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-orange-500" />
                Penjualan Hari Ini
              </span>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">Rp {stats.todaySales.toLocaleString('id-ID')}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {stats.todayTransactions} Transaksi
                </span>
                <span className="text-xs text-slate-400">Total hari ini</span>
              </div>
            </div>
          </div>

          {/* Card 2: Transaksi */}
          <div className="pro-stat-card group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag size={14} className="text-amber-500" />
                Total Transaksi
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-800 tracking-tight">{stats.totalTransactions}</p>
                <span className="text-sm font-bold text-slate-400">All Time</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded flex items-center gap-1">
                  <Target size={12} />
                  Rp {stats.totalRevenue.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400">Total Pendapatan</span>
              </div>
            </div>
          </div>

          {/* Card 3: Stok Menipis */}
          <div className="pro-stat-card group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-500" />
                Peringatan Stok
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-800 tracking-tight">{stats.lowStockCount}</p>
                <span className="text-sm font-bold text-slate-400">Produk</span>
              </div>
              <div className="mt-4">
                {stats.lowStockCount > 0 ? (
                  <Link href="/stock-locations"
                    className="inline-flex px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded items-center gap-1 hover:bg-rose-100 transition-colors">
                    <ArrowUpRight size={12} /> Cek Lokasi Stok
                  </Link>
                ) : (
                  <span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded items-center gap-1">
                    <CheckCircle2 size={12} /> Stok Aman
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch flex-1">
          {/* Aktivitas Terbaru */}
          <div className="pro-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <History size={20} className="text-slate-400" />
                Aktivitas Terbaru
              </h2>
            </div>
            <div className="flex-1 flex flex-col">
              {stats.latestActivities.length > 0 ? stats.latestActivities.map((activity, i) => {
                const isStock = activity.type === 'stock_in';
                const Icon = isStock ? PackageOpen : (activity.type === 'sale' ? ShoppingBag : Clock);
                const color = isStock ? 'text-emerald-500' : (activity.type === 'sale' ? 'text-orange-500' : 'text-slate-500');
                
                return (
                  <div key={i} className={`flex items-start gap-4 py-4 ${i !== stats.latestActivities.length - 1 ? 'border-b border-slate-100' : ''} group`}>
                    <div className={`mt-0.5 ${color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">{activity.text}</p>
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1 flex items-center gap-1">
                        <Clock size={10} /> {activity.time}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-12 text-center my-auto">
                  <History size={32} className="text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400">Belum ada aktivitas hari ini</p>
                </div>
              )}
            </div>
            <button className="w-full mt-4 py-3 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-1">
              Lihat Semua <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Produk Terlaris (List Flat) */}
          <div className="pro-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Target size={20} className="text-slate-400" />
                Produk Terlaris
              </h2>
            </div>
            <div className="flex-1 flex flex-col">
              {stats.topProducts.length > 0 ? stats.topProducts.map((item, i) => {
                const Icon = item.category === 'MINUMAN' ? Coffee : (item.category === 'MAKANAN' ? UtensilsCrossed : ShoppingBag);
                return (
                  <div key={i} className={`flex items-center justify-between py-3.5 ${i !== stats.topProducts.length - 1 ? 'border-b border-slate-100' : ''} group`}>
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400 group-hover:text-orange-500 transition-colors">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                          <CheckCircle2 size={10} /> {item.sales} unit
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {i === 0 && <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-widest">TOP</span>}
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-12 text-center my-auto">
                  <ShoppingBag size={32} className="text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400">Belum ada data penjualan</p>
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
            <h3 className="pro-label mb-8">Target Penjualan Bulanan</h3>
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
                  <span className="stat-number text-[2.25rem]">72%</span>
                  <span className="pro-label mt-1.5">Tercapai</span>
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
                      <p className="text-sm font-semibold text-text-primary">{branch.name}</p>
                      <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">{branch.id}</p>
                    </div>
                    <p className="text-sm font-bold text-orange-600">{branch.sales}</p>
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
