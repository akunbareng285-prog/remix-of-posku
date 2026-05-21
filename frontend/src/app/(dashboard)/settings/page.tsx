'use client';

import { Save, Lock, Monitor, Globe, ToggleLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
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
        <p className="text-sm text-text-muted mt-2 max-w-sm">Hanya Admin yang dapat mengelola Pengaturan Sistem.</p>
        <button onClick={() => router.push('/')} className="pro-button-primary mt-6">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">
            Pengaturan <span className="text-primary">Sistem</span>
          </h1>
          <p className="page-subtitle">Konfigurasi sistem dan preferensi</p>
        </div>
        <button onClick={() => alert('Pengaturan Perubahan berhasil disimpan!')} className="pro-button-primary">
          <Save size={16} /> Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POS Settings */}
        <div className="pro-card p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-card-border bg-slate-50/50">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Monitor size={18} />
            </div>
            <div>
              <h3 className="card-title">Pengaturan Kasir</h3>
              <p className="text-xs text-text-muted">Konfigurasi perangkat POS</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Device Name / POS ID</label>
              <input type="text" defaultValue="POS-DESKTOP-01" className="pro-input" />
            </div>

            <div className="pt-4 border-t border-card-border">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm font-medium text-text-primary">Struk Otomatis Cetak</p>
                  <p className="text-xs text-text-muted mt-0.5">Cetak struk secara otomatis setelah transaksi</p>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-checked:bg-primary rounded-full transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Global Config */}
        <div className="pro-card p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-card-border bg-slate-50/50">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="card-title">Konfigurasi Global</h3>
              <p className="text-xs text-text-muted">Pengaturan umum sistem</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Persentase Pajak Default (%)</label>
              <input type="number" defaultValue={11} className="pro-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Format Mata Uang</label>
              <select className="pro-select w-full">
                <option value="IDR">IDR — Rupiah (Rp)</option>
                <option value="USD">USD — US Dollar ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
