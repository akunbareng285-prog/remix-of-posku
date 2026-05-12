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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pro-stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-muted">Total Pendapatan</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tracking-tight">Rp 45.200.000</p>
          <p className="text-xs text-text-muted mt-2">Bulan ini</p>
        </div>

        <div className="pro-stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-muted">Total Transaksi</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tracking-tight">1.432</p>
          <p className="text-xs text-text-muted mt-2">Order bulan ini</p>
        </div>

        <div className="pro-stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-muted">Produk Terlaris</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-100 transition-colors">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-lg font-bold text-text-primary tracking-tight">Kopi Kenangan Mantan</p>
          <p className="text-xs text-text-muted mt-2">348 unit terjual</p>
        </div>
      </div>

      <div className="pro-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Penjualan 7 Hari Terakhir</h3>
            <p className="text-sm text-text-muted mt-0.5">Tren penjualan harian</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="pro-select text-sm py-1.5">
              <option>7 Hari</option>
              <option>30 Hari</option>
              <option>3 Bulan</option>
            </select>
          </div>
        </div>

        {/* Chart placeholder */}
        <div className="h-64 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center border border-card-border">
          <BarChart3 size={40} className="text-slate-300 mb-3" />
          <p className="text-sm text-text-muted font-medium">Grafik Penjualan</p>
          <p className="text-xs text-text-muted mt-1">Data akan muncul setelah integrasi</p>
        </div>
      </div>
    </div>
  );
}
