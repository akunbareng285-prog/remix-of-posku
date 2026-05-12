'use client';

import { Store, MapPin, Edit, Lock, Plus, Users as UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StoresPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const userRole = localStorage.getItem('pos_role');
    setRole(userRole || '');
  }, []);

  if (role && role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
          <Lock size={32} className="text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Akses Ditolak</h1>
        <p className="text-sm text-text-muted mt-2 max-w-sm">Hanya Admin yang dapat mengelola Toko & Cabang.</p>
        <button onClick={() => router.push('/')} className="pro-button-primary mt-6">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const branches = [
    {
      name: 'Cabang Pusat (JKT)',
      address: 'Jl. Sudirman No. 123, Jakarta',
      isPrimary: true,
      team: [
        { name: 'Siti Manager', role: 'Manager' },
        { name: 'Andi Kasir', role: 'Kasir' },
      ],
    },
    {
      name: 'Cabang Depok',
      address: 'Margonda Raya No. 45',
      isPrimary: false,
      team: [
        { name: null, role: 'Manager' },
        { name: 'Budi Kasir', role: 'Kasir' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Manajemen Toko</h1>
          <p className="text-sm text-text-muted mt-1">Kelola pusat dan cabang toko Anda</p>
        </div>
        <button className="pro-button-primary">
          <Plus size={16} /> Tambah Cabang
        </button>
      </div>

      {/* Store config */}
      <div className="pro-card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-card-border bg-slate-50/50">
          <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary">
            <Store size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Pusat: Sistem POS Utama</h3>
            <p className="text-xs text-text-muted">Konfigurasi toko utama</p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Nama Toko (Pusat)</label>
              <input type="text" defaultValue="Sistem POS Pusat" className="pro-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Alamat Pusat</label>
              <input type="text" defaultValue="Jl. Sudirman No. 123, Jakarta" className="pro-input" />
            </div>
          </div>

          {/* Branches */}
          <div className="pt-5 border-t border-card-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary">Daftar Cabang</h3>
              <button className="pro-button-secondary text-sm py-2 px-3">
                <MapPin size={14} /> Tambah Cabang
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {branches.map((branch, index) => (
                <div key={index} className="rounded-xl border border-card-border p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">{branch.name}</h4>
                      <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {branch.address}
                      </p>
                    </div>
                    {branch.isPrimary && (
                      <span className="pro-badge-info">Utama</span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-card-border">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Tim Cabang</p>
                    <div className="space-y-1.5">
                      {branch.team.map((member, mIdx) => (
                        <div key={mIdx} className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-xs ${member.name ? 'bg-slate-50' : 'bg-amber-50/50 border border-dashed border-amber-200'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${member.name ? 'bg-white border border-card-border text-text-secondary' : 'bg-amber-100 text-amber-600'}`}>
                              {member.name ? member.name.charAt(0) : '?'}
                            </div>
                            <span className={`font-medium ${member.name ? 'text-text-primary' : 'text-amber-600 italic'}`}>
                              {member.name || 'Belum ada'}
                            </span>
                          </div>
                          <span className="pro-badge-neutral">{member.role}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 py-2 rounded-lg text-xs font-medium text-text-secondary border border-card-border hover:bg-slate-50 hover:text-text-primary transition-colors flex items-center justify-center gap-1.5">
                      <Edit size={12} /> Atur Cabang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
