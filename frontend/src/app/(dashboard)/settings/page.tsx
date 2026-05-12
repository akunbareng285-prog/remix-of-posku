'use client';

import { Save, Lock, Monitor, Laptop2 } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <div className="p-6 bg-[#5644FF] text-white border-[4px] border-black shadow-[6px_6px_0px_0px_#000] mb-6 inline-block">
          <Lock size={64} className="stroke-[3px]" />
        </div>
        <h1 className="text-4xl font-black uppercase text-black">Akses Ditolak</h1>
        <p className="text-xl font-bold uppercase mt-2">Hanya Admin yang dapat mengelola Pengaturan Sistem.</p>
        <button onClick={() => router.push('/')} className="neo-button-primary mt-8">
          KEMBALI KE DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Pengaturan</h1>
        <button className="neo-button-primary flex items-center gap-2">
          <Save size={20} className="stroke-[3px]" /> SIMPAN
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sistem Settings */}
        <div className="neo-card p-0 overflow-hidden">
          <div className="bg-black text-white p-4 font-black uppercase border-b-[4px] border-black flex items-center gap-3">
            <Monitor size={24} className="stroke-[3px]" /> PENGATURAN KASIR
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div>
              <label className="block font-black uppercase text-sm mb-2">Device Name / POS ID</label>
              <input type="text" defaultValue="POS-DESKTOP-01" className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all" />
            </div>

            <div className="pt-4 border-t-[3px] border-black border-dashed">
              <label className="flex items-center gap-3 font-bold cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#5644FF] border-2 border-black" />
                Struk Otomatis Cetak (Auto-Print)
              </label>
            </div>
          </div>
        </div>

        {/* Global Config */}
        <div className="neo-card p-0 overflow-hidden">
          <div className="bg-[#5644FF] text-white p-4 font-black uppercase border-b-[4px] border-black flex items-center gap-3">
            <Laptop2 size={24} className="stroke-[3px]" /> KONFIGURASI GLOBAL
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div>
              <label className="block font-black uppercase text-sm mb-2">Persentase Pajak Default (%)</label>
              <input type="number" defaultValue={11} className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all" />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">Format Mata Uang</label>
              <select className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all">
                <option value="IDR">IDR - Rupiah (Rp)</option>
                <option value="USD">USD - US Dollar ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
