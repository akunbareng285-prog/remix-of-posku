'use client';

import { DollarSign, ShoppingBag, TrendingUp, Download, BarChart3, CreditCard, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ChartBar { day: string; revenue: number; label: string; pct: number; }
interface PayMethod { method: string; count: number; pct: number; }

const METHOD_COLORS: Record<string, string> = {
  Cash: 'bg-emerald-500',
  QRIS: 'bg-indigo-500',
  Transfer: 'bg-amber-500',
  Debit: 'bg-sky-500',
  Kredit: 'bg-rose-500',
};

export default function ReportsPage() {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    avgValue: 0,
    topProduct: { name: 'Belum ada', qty: 0 },
    chartData: [] as ChartBar[],
    productDetails: [] as any[],
    payMethods: [] as PayMethod[],
  });

  useEffect(() => {
    const transactions: any[] = JSON.parse(localStorage.getItem('pos_transactions') || '[]');

    // === KPIs ===
    const totalRev = transactions.reduce((s, t) => s + t.total, 0);
    const avgValue = transactions.length > 0 ? totalRev / transactions.length : 0;

    // === Product Sales ===
    const productSales: Record<string, { count: number; category: string; revenue: number }> = {};
    transactions.forEach(t => {
      (t.items || []).forEach((item: any) => {
        if (!productSales[item.name]) productSales[item.name] = { count: 0, category: item.category, revenue: 0 };
        productSales[item.name].count += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });
    const sortedProds = Object.entries(productSales)
      .map(([name, d]) => ({ name, cat: d.category, qty: d.count, rev: d.revenue }))
      .sort((a, b) => b.qty - a.qty);

    // === 7-Day Chart Data ===
    const chartData: ChartBar[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayKey = d.toDateString();
      const dayRev = transactions
        .filter(t => new Date(t.timestamp).toDateString() === dayKey)
        .reduce((s, t) => s + t.total, 0);
      return { day: d.toLocaleDateString('id-ID', { weekday: 'short' }), revenue: dayRev, label: '', pct: 0 };
    });
    const maxRev = Math.max(...chartData.map(c => c.revenue), 1);
    chartData.forEach(c => {
      c.pct = Math.round((c.revenue / maxRev) * 100);
      c.label = c.revenue > 0
        ? `Rp ${(c.revenue / 1_000_000).toFixed(1)}jt`
        : 'Rp 0';
    });

    // === Payment Method Distribution ===
    const methodCount: Record<string, number> = {};
    transactions.forEach(t => {
      const m = t.paymentMethod || 'Cash';
      methodCount[m] = (methodCount[m] || 0) + 1;
    });
    const total = transactions.length || 1;
    const payMethods: PayMethod[] = Object.entries(methodCount)
      .map(([method, count]) => ({ method, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);

    setData({
      totalRevenue: totalRev,
      totalTransactions: transactions.length,
      avgValue,
      topProduct: sortedProds[0] || { name: 'Belum ada', qty: 0 },
      chartData,
      productDetails: sortedProds.slice(0, 8),
      payMethods,
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Laporan</h1>
          <p className="page-subtitle">Ringkasan performa bisnis Anda</p>
        </div>
        <button className="pro-button-secondary"><Download size={15} /> Export Excel</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Total Pendapatan', value: `Rp ${data.totalRevenue.toLocaleString('id-ID')}`, sub: 'Semua Waktu', icon: DollarSign, color: 'bg-orange-500', bar: 'before:bg-orange-500' },
          { label: 'Total Transaksi', value: data.totalTransactions.toString(), sub: 'Order Berhasil', icon: ShoppingBag, color: 'bg-amber-500', bar: 'before:bg-amber-500' },
          { label: 'Rata-rata Transaksi', value: `Rp ${Math.round(data.avgValue).toLocaleString('id-ID')}`, sub: 'Per Order', icon: CreditCard, color: 'bg-emerald-500', bar: 'before:bg-emerald-500' },
          { label: 'Produk Terlaris', value: data.topProduct.name, sub: `${data.topProduct.qty} unit terjual`, icon: BarChart3, color: 'bg-indigo-500', bar: 'before:bg-indigo-500' },
        ].map(card => (
          <div key={card.label} className={`pro-stat-card ${card.bar} group relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <span className="overline">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center text-white shrink-0`}>
                <card.icon size={16} />
              </div>
            </div>
            <p className="text-lg font-bold text-text-primary truncate">{card.value}</p>
            <p className="overline mt-2">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Bar Chart — Real 7-day data */}
        <div className="pro-card flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="section-title">Penjualan 7 Hari Terakhir</h3>
              <p className="overline mt-1">Tren pendapatan harian</p>
            </div>
          </div>

          {data.chartData.every(c => c.revenue === 0) ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-text-muted">
              <TrendingUp size={36} className="mb-3 opacity-20" />
              <p className="text-sm font-medium">Belum ada data penjualan</p>
              <p className="text-xs mt-1">Data akan muncul setelah ada transaksi</p>
            </div>
          ) : (
            <div className="relative h-64 flex items-end gap-2 mt-4 pt-4">
              {/* Y-axis guide lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[4, 3, 2, 1, 0].map(i => (
                  <div key={i} className="w-full border-t border-dashed border-slate-100" />
                ))}
              </div>
              {/* Bars */}
              {data.chartData.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative z-10 group">
                  <div className="relative w-full max-w-[40px] mx-auto" style={{ height: `${Math.max(bar.pct, 4)}%` }}>
                    <div className="absolute inset-0 bg-primary rounded-t-xl transition-all duration-700 shadow-md shadow-primary/20 group-hover:bg-primary-hover" />
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-semibold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-20 shadow-xl">
                      {bar.label}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-800" />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-2 uppercase">{bar.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method Breakdown */}
        <div className="pro-card flex flex-col">
          <div className="mb-6">
            <h3 className="section-title">Metode Pembayaran</h3>
            <p className="overline mt-1">Distribusi metode bayar</p>
          </div>

          {data.payMethods.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-text-muted">
              <Wallet size={32} className="mb-3 opacity-20" />
              <p className="text-sm font-medium">Belum ada data</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {data.payMethods.map(m => (
                <div key={m.method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${METHOD_COLORS[m.method] || 'bg-slate-400'}`} />
                      <span className="text-sm font-semibold text-text-primary">{m.method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">{m.count}x</span>
                      <span className="text-sm font-bold text-text-primary w-9 text-right">{m.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${METHOD_COLORS[m.method] || 'bg-slate-400'} rounded-full transition-all duration-700`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="pro-card">
        <h3 className="section-title mb-6">Rincian Produk Terlaris</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Nama Produk</th>
                <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Kategori</th>
                <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Terjual</th>
                <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Pendapatan</th>
                <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right pr-2">Kontribusi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {data.productDetails.length > 0 ? data.productDetails.map((item, i) => {
                const pct = data.totalRevenue > 0 ? Math.round((item.rev / data.totalRevenue) * 100) : 0;
                return (
                  <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3.5 font-semibold text-text-primary">{item.name}</td>
                    <td className="py-3.5"><span className="pro-badge-info text-xs">{item.cat}</span></td>
                    <td className="py-3.5 text-right font-bold text-primary">{item.qty}</td>
                    <td className="py-3.5 text-right text-text-secondary">Rp {item.rev.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-text-muted w-8 text-right">{pct}%</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">Belum ada data penjualan produk</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
