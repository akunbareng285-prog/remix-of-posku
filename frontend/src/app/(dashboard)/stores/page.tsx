'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, X, Save, Building2, Warehouse, Store } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'store' | 'warehouse';
  address: string;
  phone?: string;
  isActive: boolean;
}

const defaultLocations: Location[] = [
  { id: 'LOC-1', name: 'Gudang Utama', type: 'warehouse', address: 'Jl. Industri No. 1, Jakarta', isActive: true },
  { id: 'LOC-2', name: 'Toko Pusat', type: 'store', address: 'Jl. Sudirman No. 123, Jakarta', phone: '021-5551234', isActive: true },
  { id: 'LOC-3', name: 'Cabang Depok', type: 'store', address: 'Margonda Raya No. 45, Depok', phone: '021-7778900', isActive: true },
];

const emptyForm: Omit<Location, 'id'> = {
  name: '', type: 'store', address: '', phone: '', isActive: true,
};

export default function StoresPage() {
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState<Omit<Location, 'id'>>(emptyForm);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pos_locations');
    if (saved) setLocations(JSON.parse(saved));
    else localStorage.setItem('pos_locations', JSON.stringify(defaultLocations));
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 2500); return () => clearTimeout(t); }
  }, [toast]);

  const sync = (data: Location[]) => {
    setLocations(data);
    localStorage.setItem('pos_locations', JSON.stringify(data));
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setIsModalOpen(true); };
  const openEdit = (l: Location) => { setEditing(l); setForm({ name: l.name, type: l.type, address: l.address, phone: l.phone, isActive: l.isActive }); setIsModalOpen(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      sync(locations.map(l => l.id === editing.id ? { ...editing, ...form } : l));
      setToast(`Lokasi "${form.name}" diperbarui`);
    } else {
      sync([...locations, { id: `LOC-${Date.now().toString().slice(-5)}`, ...form }]);
      setToast(`Lokasi "${form.name}" ditambahkan`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (l: Location) => {
    if (!confirm(`Hapus lokasi "${l.name}"? Ini akan mempengaruhi data stok.`)) return;
    sync(locations.filter(x => x.id !== l.id));
    setToast(`Lokasi "${l.name}" dihapus`);
  };

  const toggleActive = (id: string) => {
    sync(locations.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const stores = locations.filter(l => l.type === 'store');
  const warehouses = locations.filter(l => l.type === 'warehouse');

  const LocationCard = ({ loc }: { loc: Location }) => (
    <div className={`pro-card-elevated flex flex-col gap-4 transition-all ${!loc.isActive ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${loc.type === 'store' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
            {loc.type === 'store' ? <Store size={20} /> : <Warehouse size={20} />}
          </div>
          <div>
            <h3 className="card-title">{loc.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${loc.type === 'store' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                {loc.type === 'store' ? 'Toko' : 'Gudang'}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${loc.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {loc.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => openEdit(loc)} className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
            <Edit size={14} />
          </button>
          <button onClick={() => handleDelete(loc)} className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="space-y-2 pt-3 border-t border-slate-100">
        {loc.address && (
          <div className="flex items-start gap-2 text-xs text-text-secondary">
            <MapPin size={12} className="text-text-muted shrink-0 mt-0.5" />
            {loc.address}
          </div>
        )}
        {loc.phone && (
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Building2 size={12} className="text-text-muted shrink-0" />
            {loc.phone}
          </div>
        )}
      </div>
      <button onClick={() => toggleActive(loc.id)}
        className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${loc.isActive
          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
        }`}>
        {loc.isActive ? 'Nonaktifkan' : 'Aktifkan'}
      </button>
    </div>
  );

  return (
    <div className="space-y-7 animate-fade-in">
      {toast && (
        <div className="fixed top-4 right-4 z-[200] px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl shadow-lg animate-slide-in">
          ✓ {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Manajemen <span className="text-primary">Lokasi</span></h1>
          <p className="page-subtitle">{stores.length} toko · {warehouses.length} gudang terdaftar</p>
        </div>
        <button onClick={openAdd} className="pro-button-primary">
          <Plus size={16} /> Tambah Lokasi
        </button>
      </div>

      {/* Toko Section */}
      {stores.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Store size={16} className="text-primary" />
            <h2 className="section-title">Toko / Selling Point</h2>
            <span className="pro-badge-info text-xs">{stores.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {stores.map(l => <LocationCard key={l.id} loc={l} />)}
          </div>
        </div>
      )}

      {/* Gudang Section */}
      {warehouses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Warehouse size={16} className="text-slate-500" />
            <h2 className="section-title">Gudang</h2>
            <span className="pro-badge-neutral text-xs">{warehouses.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {warehouses.map(l => <LocationCard key={l.id} loc={l} />)}
          </div>
        </div>
      )}

      {locations.length === 0 && (
        <div className="py-20 text-center">
          <MapPin size={36} className="mx-auto text-text-muted mb-3 opacity-30" />
          <p className="text-text-muted font-medium">Belum ada lokasi terdaftar</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="section-title">{editing ? 'Edit Lokasi' : 'Tambah Lokasi'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-text-muted hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nama Lokasi <span className="text-danger">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="pro-input" placeholder="Nama toko / gudang" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Tipe</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['store', 'warehouse'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.type === t ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-text-muted hover:border-slate-300'}`}>
                      {t === 'store' ? <Store size={16} /> : <Warehouse size={16} />}
                      {t === 'store' ? 'Toko' : 'Gudang'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Alamat</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  rows={2} className="pro-input resize-none" placeholder="Alamat lengkap..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Telepon</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="pro-input" placeholder="021-xxxx-xxxx" />
              </div>
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="pro-button-secondary flex-1">Batal</button>
                <button type="submit" className="pro-button-primary flex-1">
                  <Save size={15} /> {editing ? 'Simpan' : 'Tambah Lokasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
