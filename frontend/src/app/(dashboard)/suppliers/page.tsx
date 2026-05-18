'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Search, Edit, Trash2, X, Save, Phone, Mail, MapPin, Truck } from 'lucide-react';

interface Supplier {
  id: string; name: string; contact: string;
  phone: string; email: string; address: string;
}

const initialSuppliers: Supplier[] = [
  { id: 'SUP-1', name: 'PT Sinar Jaya', contact: 'Budi Santoso', phone: '0812-3456-7890', email: 'budi@sinarjaya.com', address: 'Jl. Industri No. 12, Jakarta' },
  { id: 'SUP-2', name: 'CV Makmur Sentosa', contact: 'Siti Rahayu', phone: '0821-9876-5432', email: 'siti@makmur.co.id', address: 'Jl. Pahlawan No. 5, Depok' },
  { id: 'SUP-3', name: 'Toko Grosir Utama', contact: 'Ahmad Fauzi', phone: '0813-1111-2222', email: 'grosir@utama.id', address: 'Pasar Induk Kramat Jati, Blok B5' },
];

const emptyForm: Omit<Supplier, 'id'> = { name: '', contact: '', phone: '', email: '', address: '' };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Omit<Supplier, 'id'>>(emptyForm);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pos_suppliers');
    if (saved) setSuppliers(JSON.parse(saved));
    else localStorage.setItem('pos_suppliers', JSON.stringify(initialSuppliers));
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const sync = (data: Supplier[]) => {
    setSuppliers(data);
    localStorage.setItem('pos_suppliers', JSON.stringify(data));
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setIsModalOpen(true); };
  const openEdit = (s: Supplier) => { setEditing(s); setForm({ name: s.name, contact: s.contact, phone: s.phone, email: s.email, address: s.address }); setIsModalOpen(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      sync(suppliers.map(s => s.id === editing.id ? { ...editing, ...form } : s));
      setToast(`Supplier "${form.name}" diperbarui`);
    } else {
      const newS: Supplier = { id: `SUP-${Date.now().toString().slice(-5)}`, ...form };
      sync([...suppliers, newS]);
      setToast(`Supplier "${form.name}" ditambahkan`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (s: Supplier) => {
    if (!confirm(`Hapus supplier "${s.name}"?`)) return;
    sync(suppliers.filter(x => x.id !== s.id));
    setToast(`Supplier "${s.name}" dihapus`);
  };

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-4 right-4 z-[200] px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl shadow-lg animate-slide-in flex items-center gap-2">
          ✓ {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Data <span className="text-primary">Supplier</span></h1>
          <p className="page-subtitle">{suppliers.length} supplier terdaftar</p>
        </div>
        <button onClick={openAdd} className="pro-button-primary">
          <UserPlus size={16} /> Tambah Supplier
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
        <input type="text" placeholder="Cari supplier..." value={search}
          onChange={e => setSearch(e.target.value)} className="pro-input pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <Truck size={32} className="mx-auto text-text-muted mb-2" />
            <p className="text-text-muted">Tidak ada supplier ditemukan</p>
          </div>
        ) : filtered.map(s => (
          <div key={s.id} className="pro-card-elevated flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {s.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="card-title leading-tight">{s.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{s.contact}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(s)} className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-slate-100">
              {s.phone && (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Phone size={12} className="text-text-muted shrink-0" /> {s.phone}
                </div>
              )}
              {s.email && (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Mail size={12} className="text-text-muted shrink-0" /> {s.email}
                </div>
              )}
              {s.address && (
                <div className="flex items-start gap-2 text-xs text-text-secondary">
                  <MapPin size={12} className="text-text-muted shrink-0 mt-0.5" /> {s.address}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="section-title">{editing ? 'Edit Supplier' : 'Tambah Supplier'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-text-muted hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Nama Supplier <span className="text-danger">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="pro-input" placeholder="PT / CV / Toko..." required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Kontak Person</label>
                  <input type="text" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                    className="pro-input" placeholder="Nama PIC" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Telepon</label>
                  <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="pro-input" placeholder="0812-xxxx-xxxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="pro-input" placeholder="email@supplier.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Alamat</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  rows={2} className="pro-input resize-none" placeholder="Alamat lengkap supplier..." />
              </div>
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="pro-button-secondary flex-1">Batal</button>
                <button type="submit" className="pro-button-primary flex-1">
                  <Save size={15} /> {editing ? 'Simpan Perubahan' : 'Tambah Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
