import Link from 'next/link';
import { TrendingUp, ShoppingBag, AlertTriangle, ArrowUpRight, Plus, PackageOpen, ArrowRightLeft, FileText } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Ringkasan aktivitas hari ini</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Penjualan */}
        <div className="pro-stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-muted">Penjualan Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tracking-tight">Rp 4.250.000</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="pro-badge-success">
              <ArrowUpRight size={12} className="mr-0.5" /> +12%
            </span>
            <span className="text-xs text-text-muted">dari kemarin</span>
          </div>
        </div>

        {/* Card 2: Transaksi */}
        <div className="pro-stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-muted">Total Transaksi</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tracking-tight">42</p>
          <p className="text-xs text-text-muted mt-3">Transaksi hari ini</p>
        </div>

        {/* Card 3: Stok Menipis */}
        <div className="pro-stat-card group border-amber-200 bg-gradient-to-br from-amber-50/50 to-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-amber-700">Produk Stok Tipis</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200/70 transition-colors">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tracking-tight">
            5 <span className="text-sm font-medium text-text-muted">item</span>
          </p>
          <div className="mt-3">
            <span className="pro-badge-warning">Segera re-stock</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pro-card">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/pos"
            className="flex flex-col items-center gap-3 p-5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Plus size={22} />
            </div>
            <span className="text-sm font-semibold text-center">Transaksi Baru</span>
          </Link>

          <button className="flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-50 text-text-primary border border-card-border hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-card-border group-hover:border-slate-300 transition-colors">
              <PackageOpen size={20} className="text-text-secondary" />
            </div>
            <span className="text-sm font-semibold text-center">Barang Masuk</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-50 text-text-primary border border-card-border hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-card-border group-hover:border-slate-300 transition-colors">
              <ArrowRightLeft size={20} className="text-text-secondary" />
            </div>
            <span className="text-sm font-semibold text-center">Transfer Stok</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <FileText size={20} />
            </div>
            <span className="text-sm font-semibold text-center">Laporan Harian</span>
          </button>
        </div>
      </div>
    </div>
  );
}
