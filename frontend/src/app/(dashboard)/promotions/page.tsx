'use client';

import { useState, useEffect } from 'react';
import { Plus, Tag, Edit, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';

type PromoType = 'category_discount' | 'buy_x_get_y' | 'period_discount';

interface Promotion {
  id: string;
  name: string;
  type: PromoType;
  category?: string;
  discountType?: 'percent' | 'nominal';
  discountValue?: number;
  buyQty?: number;
  getQty?: number;
  minPurchase?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

const typeLabels: Record<PromoType, string> = {
  category_discount: 'Diskon Kategori',
  buy_x_get_y: 'Beli X Gratis Y',
  period_discount: 'Diskon Periode',
};

const typeBadge: Record<PromoType, string> = {
  category_discount: 'pro-badge-info',
  buy_x_get_y: 'pro-badge-warning',
  period_discount: 'pro-badge-success',
};

const emptyForm: Omit<Promotion, 'id'> = {
  name: '',
  type: 'category_discount',
  category: '',
  discountType: 'percent',
  discountValue: 10,
  buyQty: 3,
  getQty: 1,
  minPurchase: 0,
  startDate: '',
  endDate: '',
  isActive: true,
};

const initialPromos: Promotion[] = [
  { id: 'PRO-1', name: 'Diskon Minuman 15%', type: 'category_discount', category: 'MINUMAN', discountType: 'percent', discountValue: 15, isActive: true },
  { id: 'PRO-2', name: 'Beli 3 Snack Gratis 1', type: 'buy_x_get_y', buyQty: 3, getQty: 1, isActive: true },
  { id: 'PRO-3', name: 'Weekend Sale', type: 'period_discount', discountType: 'percent', discountValue: 10, startDate: '2026-05-17', endDate: '2026-05-18', minPurchase: 50000, isActive: false },
];

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>(initialPromos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState<Omit<Promotion, 'id'>>(emptyForm);
  const [categories, setCategories] = useState<string[]>(['MAKANAN', 'MINUMAN', 'SNACK']);

  useEffect(() => {
    const saved = localStorage.getItem('pos_promotions');
    if (saved) setPromos(JSON.parse(saved));
    else localStorage.setItem('pos_promotions', JSON.stringify(initialPromos));
    const cats = localStorage.getItem('pos_categories');
    if (cats) setCategories(JSON.parse(cats));
  }, []);

  const sync = (data: Promotion[]) => {
    setPromos(data);
    localStorage.setItem('pos_promotions', JSON.stringify(data));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };
  const openEdit = (p: Promotion) => {
    setEditing(p);
    setForm({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      sync(promos.map((p) => (p.id === editing.id ? { ...editing, ...form } : p)));
    } else {
      sync([...promos, { id: `PRO-${Date.now().toString().slice(-5)}`, ...form }]);
    }
    setIsModalOpen(false);
  };

  const toggleActive = (id: string) => {
    sync(promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  };

  const handleDelete = (p: Promotion) => {
    if (!confirm(`Hapus promosi "${p.name}"?`)) return;
    sync(promos.filter((x) => x.id !== p.id));
  };

  const getDescription = (p: Promotion) => {
    if (p.type === 'category_discount') return `Diskon ${p.discountValue}${p.discountType === 'percent' ? '%' : ' Rp'} untuk kategori ${p.category}`;
    if (p.type === 'buy_x_get_y') return `Beli ${p.buyQty} gratis ${p.getQty}`;
    if (p.type === 'period_discount') return `Diskon ${p.discountValue}${p.discountType === 'percent' ? '%' : ' Rp'} (${p.startDate} – ${p.endDate})${p.minPurchase ? `, min. Rp ${p.minPurchase?.toLocaleString('id-ID')}` : ''}`;
    return '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">
            Diskon &amp; <span className="text-primary">Promosi</span>
          </h1>
          <p className="page-subtitle">
            {promos.filter((p) => p.isActive).length} promosi aktif dari {promos.length} total
          </p>
        </div>
        <button onClick={openAdd} className="pro-button-primary">
          <Plus size={16} /> Buat Promosi
        </button>
      </div>

      {/* Active Promo Banner */}
      {promos.filter((p) => p.isActive).length > 0 && (
        <div className="p-4 bg-gradient-to-r from-primary/10 to-amber-50 border border-primary/20 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Tag size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{promos.filter((p) => p.isActive).length} promosi sedang aktif</p>
            <p className="text-xs text-text-muted">Promosi aktif akan diterapkan otomatis di kasir</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {promos.length === 0 ? (
          <div className="py-16 text-center">
            <Tag size={32} className="mx-auto text-text-muted mb-2" />
            <p className="text-text-muted">Belum ada promosi dibuat</p>
          </div>
        ) : (
          promos.map((p) => (
            <div
              key={p.id}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${p.isActive ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-50/50 border-slate-100 opacity-70'}`}
            >
              <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.isActive ? 'bg-orange-50 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                <Tag size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-base font-bold text-slate-800">{p.name}</h3>
                  <span className={`${typeBadge[p.type]} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md`}>{typeLabels[p.type]}</span>
                  {!p.isActive && <span className="bg-slate-100 text-slate-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md">Nonaktif</span>}
                </div>
                <p className="text-sm font-medium text-slate-500">{getDescription(p)}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-4">
                <button
                  onClick={() => toggleActive(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${p.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {p.isActive ? (
                    <>
                      <ToggleRight size={16} /> Aktif
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} /> Nonaktif
                    </>
                  )}
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <button onClick={() => openEdit(p)} className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-orange-50 transition-colors" title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(p)} className="p-2 rounded-xl text-slate-400 hover:text-danger hover:bg-red-50 transition-colors" title="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="section-title">{editing ? 'Edit Promosi' : 'Buat Promosi Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-text-muted hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nama Promosi <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pro-input" placeholder="Nama promosi..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Tipe Promosi</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PromoType })} className="pro-select w-full">
                  <option value="category_discount">Diskon Kategori</option>
                  <option value="buy_x_get_y">Beli X Gratis Y</option>
                  <option value="period_discount">Diskon Periode</option>
                </select>
              </div>

              {form.type === 'category_discount' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Kategori</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="pro-select w-full">
                      <option value="">Semua Kategori</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Nilai Diskon</label>
                    <div className="flex gap-2">
                      <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percent' | 'nominal' })} className="pro-select w-20 shrink-0">
                        <option value="percent">%</option>
                        <option value="nominal">Rp</option>
                      </select>
                      <input type="number" value={form.discountValue} min={0} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="pro-input flex-1" />
                    </div>
                  </div>
                </div>
              )}

              {form.type === 'buy_x_get_y' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Beli (Qty)</label>
                    <input type="number" value={form.buyQty} min={1} onChange={(e) => setForm({ ...form, buyQty: Number(e.target.value) })} className="pro-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Gratis (Qty)</label>
                    <input type="number" value={form.getQty} min={1} onChange={(e) => setForm({ ...form, getQty: Number(e.target.value) })} className="pro-input" />
                  </div>
                </div>
              )}

              {form.type === 'period_discount' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Tanggal Mulai</label>
                      <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="pro-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Tanggal Selesai</label>
                      <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="pro-input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Nilai Diskon</label>
                      <div className="flex gap-2">
                        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percent' | 'nominal' })} className="pro-select w-20 shrink-0">
                          <option value="percent">%</option>
                          <option value="nominal">Rp</option>
                        </select>
                        <input type="number" value={form.discountValue} min={0} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="pro-input flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Min. Pembelian (Rp)</label>
                      <input type="number" value={form.minPurchase} min={0} onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })} className="pro-input" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-text-primary">Status Promosi</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${form.isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-text-muted'}`}
                >
                  {form.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {form.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="pro-button-secondary flex-1">
                  Batal
                </button>
                <button type="submit" className="pro-button-primary flex-1">
                  <Save size={15} /> {editing ? 'Simpan' : 'Buat Promosi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
