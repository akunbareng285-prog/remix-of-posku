'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Plus, PackageSearch } from 'lucide-react';

export default function MutationsPage() {
  const [search, setSearch] = useState('');
  const [mutations, setMutations] = useState<any[]>([]);

  useEffect(() => {
    const savedMutations = JSON.parse(localStorage.getItem('pos_mutations') || '[]');
    setMutations(savedMutations);
  }, []);

  const filtered = mutations.filter((m) => m.product.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Mutasi Stok</h1>
          <p className="page-subtitle">Riwayat perpindahan stok antar cabang</p>
        </div>
        <button className="pro-button-primary">
          <Plus size={16} /> Buat Mutasi
        </button>
      </div>

      <div className="pro-card">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Cari ID mutasi atau nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pro-input pl-10"
            />
          </div>
          <select className="pro-select">
            <option>Semua Status</option>
            <option>Proses</option>
            <option>Selesai</option>
          </select>
        </div>

        <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>ID & Tanggal</th>
              <th>Produk & Qty</th>
              <th>Alur Mutasi</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((mut) => (
              <tr key={mut.id}>
                <td>
                  <div>
                    <p className="font-semibold text-text-primary">{mut.id}</p>
                    <p className="text-xs text-text-muted mt-0.5">{mut.date}</p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="pro-badge-neutral">{mut.qty} pcs</span>
                    <span className="font-medium">{mut.product}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-medium text-text-secondary">{mut.from}</span>
                    <ArrowRight size={14} className="text-text-muted shrink-0" />
                    <span className="px-2.5 py-1 bg-primary-light text-primary rounded-lg font-medium">{mut.to}</span>
                  </div>
                </td>
                <td className="text-center">
                  <span className={mut.status === 'Selesai' ? 'pro-badge-success' : 'pro-badge-warning'}>
                    {mut.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <PackageSearch size={32} className="text-text-muted mb-2" />
                    <p className="text-text-muted font-medium">Tidak ada mutasi ditemukan</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
