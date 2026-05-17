'use client';

import { useState, useEffect } from 'react';
import { Search, Receipt, ShoppingBag, TrendingUp, CreditCard, Eye, X } from 'lucide-react';

interface TxItem { id: number; name: string; price: number; quantity: number; category: string; }
interface Transaction {
  id: string; date: string; items: TxItem[];
  total: number; cashier: string; location: string;
  paymentMethod?: string; timestamp: number;
}

const methodColors: Record<string, string> = {
  'Cash': 'pro-badge-success',
  'QRIS': 'pro-badge-info',
  'Transfer': 'pro-badge-warning',
  'Debit': 'pro-badge-neutral',
  'Kredit': 'pro-badge-danger',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<Transaction | null>(null);

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
    setTransactions(t.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp));
  }, []);

  const filtered = transactions.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.cashier?.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filtered.reduce((s, t) => s + t.total, 0);
  const avgValue = filtered.length > 0 ? totalRevenue / filtered.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Transaksi</h1>
        <p className="page-subtitle">Riwayat seluruh penjualan dari semua kasir</p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Transaksi', value: filtered.length.toString(), icon: ShoppingBag, color: 'bg-amber-500', badge: 'before:bg-amber-500' },
          { label: 'Total Pendapatan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, icon: TrendingUp, color: 'bg-orange-500', badge: 'before:bg-orange-500' },
          { label: 'Rata-rata Transaksi', value: `Rp ${Math.round(avgValue).toLocaleString('id-ID')}`, icon: CreditCard, color: 'bg-emerald-500', badge: 'before:bg-emerald-500' },
        ].map(card => (
          <div key={card.label} className={`pro-stat-card ${card.badge}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="overline">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center text-white`}>
                <card.icon size={17} />
              </div>
            </div>
            <p className="stat-number text-[1.6rem]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
        <input type="text" placeholder="Cari kode transaksi / kasir..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="pro-input pl-10" />
      </div>

      {/* Table */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Tanggal</th>
              <th>Kasir</th>
              <th>Lokasi</th>
              <th className="text-center">Item</th>
              <th>Metode</th>
              <th className="text-right">Total</th>
              <th className="text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12">
                <Receipt size={28} className="mx-auto text-text-muted mb-2" />
                <p className="text-text-muted">Belum ada transaksi</p>
              </td></tr>
            ) : filtered.map(tx => (
              <tr key={tx.id}>
                <td><span className="font-mono text-sm font-semibold text-text-primary">{tx.id}</span></td>
                <td className="text-sm text-text-secondary whitespace-nowrap">{tx.date}</td>
                <td className="text-sm font-medium">{tx.cashier || '-'}</td>
                <td><span className="pro-badge-info text-xs">{tx.location || '-'}</span></td>
                <td className="text-center text-sm font-medium">{tx.items?.length || 0}</td>
                <td>
                  <span className={`${methodColors[tx.paymentMethod || 'Cash'] || 'pro-badge-neutral'} text-xs`}>
                    {tx.paymentMethod || 'Cash'}
                  </span>
                </td>
                <td className="text-right font-bold text-sm text-primary">
                  Rp {Math.round(tx.total).toLocaleString('id-ID')}
                </td>
                <td className="text-center">
                  <button onClick={() => setDetail(tx)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="section-title">{detail.id}</h2>
                <p className="text-xs text-text-muted mt-0.5">{detail.date}</p>
              </div>
              <button onClick={() => setDetail(null)} className="p-2 rounded-lg text-text-muted hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4 text-sm">
                <div><span className="text-text-muted">Kasir:</span> <span className="font-semibold">{detail.cashier}</span></div>
                <div><span className="text-text-muted">Lokasi:</span> <span className="font-semibold">{detail.location}</span></div>
              </div>
              <div className="space-y-2">
                {detail.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-text-muted ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span>Rp {Math.round(detail.total / 1.11).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">PPN 11%</span>
                  <span>Rp {Math.round(detail.total - detail.total / 1.11).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-primary">Rp {Math.round(detail.total).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setDetail(null)} className="pro-button-secondary w-full">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
