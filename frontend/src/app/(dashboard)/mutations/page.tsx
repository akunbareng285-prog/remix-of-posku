'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRightLeft, PackageCheck, ShoppingBag, Filter } from 'lucide-react';

type MutationType = 'all' | 'sale' | 'stock_in' | 'transfer';

interface MutationRow {
  id: string; date: string; type: 'sale' | 'stock_in' | 'transfer';
  description: string; qty: number; location: string; ref?: string;
}

const TYPE_LABELS: Record<string, string> = {
  sale: 'Penjualan', stock_in: 'Barang Masuk', transfer: 'Transfer Stok',
};
const TYPE_BADGE: Record<string, string> = {
  sale: 'pro-badge-warning', stock_in: 'pro-badge-success', transfer: 'pro-badge-info',
};
const TYPE_ICON: Record<string, React.ElementType> = {
  sale: ShoppingBag, stock_in: PackageCheck, transfer: ArrowRightLeft,
};

export default function MutationsPage() {
  const [mutations, setMutations] = useState<MutationRow[]>([]);
  const [filter, setFilter] = useState<MutationType>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const rows: MutationRow[] = [];

    // --- Sales from pos_mutations ---
    const sales: any[] = JSON.parse(localStorage.getItem('pos_mutations') || '[]');
    sales.forEach(m => {
      rows.push({
        id: m.id || `MUT-${Date.now()}`,
        date: m.date || '-',
        type: 'sale',
        description: `${m.product} × ${m.qty}`,
        qty: m.qty || 0,
        location: m.from || '-',
        ref: m.id,
      });
    });

    // --- Stock In from pos_stock_in ---
    const stockIns: any[] = JSON.parse(localStorage.getItem('pos_stock_in') || '[]');
    stockIns.forEach(s => {
      rows.push({
        id: s.id,
        date: s.date,
        type: 'stock_in',
        description: `${s.totalQty} item dari ${s.supplierName || 'Supplier'}`,
        qty: s.totalQty,
        location: s.locationName || '-',
        ref: s.id,
      });
    });

    // --- Transfers from pos_transfers ---
    const transfers: any[] = JSON.parse(localStorage.getItem('pos_transfers') || '[]');
    transfers.forEach(t => {
      rows.push({
        id: t.id,
        date: t.date,
        type: 'transfer',
        description: `${t.totalQty} item: ${t.fromLocationName} → ${t.toLocationName}`,
        qty: t.totalQty,
        location: `${t.fromLocationName} → ${t.toLocationName}`,
        ref: t.id,
      });
    });

    // Sort by date descending (newest first)
    rows.sort((a, b) => b.date.localeCompare(a.date));
    setMutations(rows);
  }, []);

  const filtered = mutations.filter(m => {
    const matchType = filter === 'all' || m.type === filter;
    const matchSearch = m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const counts = {
    all: mutations.length,
    sale: mutations.filter(m => m.type === 'sale').length,
    stock_in: mutations.filter(m => m.type === 'stock_in').length,
    transfer: mutations.filter(m => m.type === 'transfer').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Riwayat <span className="text-primary">Mutasi</span></h1>
        <p className="page-subtitle">Log seluruh pergerakan stok — penjualan, barang masuk, dan transfer</p>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: 'all', label: 'Semua', icon: Filter },
          { key: 'sale', label: 'Penjualan', icon: ShoppingBag },
          { key: 'stock_in', label: 'Barang Masuk', icon: PackageCheck },
          { key: 'transfer', label: 'Transfer', icon: ArrowRightLeft },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
              filter === tab.key
                ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                : 'border-slate-200 bg-white text-text-secondary hover:border-primary/30 hover:text-primary'
            }`}>
            <tab.icon size={14} />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-text-muted'}`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
        <input type="text" placeholder="Cari produk / lokasi / ID..."
          value={search} onChange={e => setSearch(e.target.value)} className="pro-input pl-10" />
      </div>

      {/* Table */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tanggal</th>
              <th>Tipe</th>
              <th>Deskripsi</th>
              <th className="text-center">Qty</th>
              <th>Lokasi / Rute</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-14">
                  <ArrowRightLeft size={28} className="mx-auto text-text-muted mb-2 opacity-30" />
                  <p className="text-text-muted">
                    {mutations.length === 0 ? 'Belum ada mutasi stok' : 'Tidak ada hasil untuk filter ini'}
                  </p>
                </td>
              </tr>
            ) : filtered.map(m => {
              const Icon = TYPE_ICON[m.type];
              return (
                <tr key={`${m.id}-${m.date}`}>
                  <td><span className="font-mono text-xs font-semibold text-text-secondary">{m.id.slice(0, 12)}</span></td>
                  <td className="text-sm text-text-secondary whitespace-nowrap">{m.date}</td>
                  <td>
                    <span className={`${TYPE_BADGE[m.type]} text-xs flex items-center gap-1.5 w-fit`}>
                      <Icon size={11} />
                      {TYPE_LABELS[m.type]}
                    </span>
                  </td>
                  <td className="text-sm font-medium text-text-primary max-w-xs">{m.description}</td>
                  <td className="text-center">
                    <span className={`text-sm font-bold ${
                      m.type === 'sale' ? 'text-amber-600' :
                      m.type === 'stock_in' ? 'text-emerald-600' : 'text-indigo-600'
                    }`}>
                      {m.type === 'sale' ? '−' : '+'}{m.qty}
                    </span>
                  </td>
                  <td className="text-sm text-text-secondary">{m.location}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-text-muted text-right">
          Menampilkan {filtered.length} dari {mutations.length} mutasi
        </p>
      )}
    </div>
  );
}
