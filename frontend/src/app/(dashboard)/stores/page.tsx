'use client';

import { Store, UserPlus, MapPin, Edit, Save, Lock, ArrowRight } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <div className="p-6 bg-[#5644FF] text-white border-[4px] border-black shadow-[6px_6px_0px_0px_#000] mb-6 inline-block">
          <Lock size={64} className="stroke-[3px]" />
        </div>
        <h1 className="text-4xl font-black uppercase text-black">Akses Ditolak</h1>
        <p className="text-xl font-bold uppercase mt-2">Hanya Admin yang dapat mengelola Toko & Cabang.</p>
        <button onClick={() => router.push('/')} className="neo-button-primary mt-8">
          KEMBALI KE DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Manajemen Toko</h1>
        <button className="neo-button-primary flex items-center gap-2">
          <Store size={20} className="stroke-[3px]" /> PUSAT BARU
        </button>
      </div>

      <div className="space-y-6">
        {/* Cabang Pusat */}
        <div className="neo-card p-0 overflow-hidden">
          <div className="bg-black text-white p-4 font-black uppercase border-b-[4px] border-black flex items-center gap-3">
            <Store size={24} className="stroke-[3px]" /> Pusat : Sistem POS Utama
          </div>

          <div className="p-6 bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-black uppercase text-sm mb-2">Nama Toko (Pusat)</label>
                <input type="text" defaultValue="Sistem POS Pusat" className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all" />
              </div>
              <div>
                <label className="block font-black uppercase text-sm mb-2">Alamat Pusat</label>
                <input type="text" defaultValue="Jl. Sudirman No. 123, Jakarta" className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all" />
              </div>
            </div>

            <div className="pt-6 border-t-[3px] border-black border-dashed">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black uppercase text-lg">Daftar Cabang</h3>
                <button className="text-sm font-bold bg-[#5644FF] text-white px-3 py-2 border-[3px] border-black flex items-center gap-1 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <MapPin size={16} className="stroke-[3px]" /> TAMBAH CABANG
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Cabang 1 */}
                <div className="border-[3px] border-black p-4 bg-white shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-black uppercase text-xl">Cabang Pusat (JKT)</h4>
                      <p className="text-sm font-bold flex items-center gap-1">
                        <MapPin size={14} /> Jl. Sudirman No. 123, Jakarta
                      </p>
                    </div>
                    <span className="bg-black text-white px-3 py-1 text-xs font-black">UTAMA</span>
                  </div>

                  <div className="mt-4 pt-4 border-t-[2px] border-black">
                    <h5 className="font-black text-xs uppercase mb-2">Tim Cabang:</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white border-[2px] border-black p-2">
                        <span className="font-bold text-sm">Manager: Siti Manager</span>
                        <span className="text-xs bg-black text-white px-2 py-0.5 font-bold">1 Akun</span>
                      </div>
                      <div className="flex justify-between items-center bg-white border-[2px] border-black p-2">
                        <span className="font-bold text-sm">Kasir: Andi Kasir</span>
                        <span className="text-xs bg-white text-black border border-black px-2 py-0.5 font-bold">1 Akun</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center gap-2 border-[2px] border-black py-2 font-black uppercase hover:bg-black hover:text-white transition-colors">
                      <Edit size={16} /> ATUR CABANG INI
                    </button>
                  </div>
                </div>

                {/* Card Cabang 2 */}
                <div className="border-[3px] border-black p-4 bg-white shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-black uppercase text-xl">Cabang Depok</h4>
                      <p className="text-sm font-bold flex items-center gap-1">
                        <MapPin size={14} /> Margonda Raya No. 45
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t-[2px] border-black">
                    <h5 className="font-black text-xs uppercase mb-2">Tim Cabang:</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white border-[2px] border-black border-dashed p-2 text-gray-500">
                        <span className="font-bold text-sm italic">Belum Ada Manager</span>
                      </div>
                      <div className="flex justify-between items-center bg-white border-[2px] border-black p-2">
                        <span className="font-bold text-sm">Kasir: Budi Kasir</span>
                        <span className="text-xs bg-white text-black border border-black px-2 py-0.5 font-bold">1 Akun</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center gap-2 border-[2px] border-black py-2 font-black uppercase hover:bg-black hover:text-white transition-colors">
                      <Edit size={16} /> ATUR CABANG INI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
