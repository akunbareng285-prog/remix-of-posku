'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, ShieldCheck, ShoppingCart, BarChart } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: string, name: string) => {
    localStorage.setItem('pos_role', role);
    localStorage.setItem('pos_user_name', name);

    // Redirect based on role
    if (role === 'KASIR') {
      router.push('/pos');
    } else {
      router.push('/');
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin') handleLogin('ADMIN', 'Super Admin');
    else if (username === 'kasir') handleLogin('KASIR', 'Budi Kasir');
    else if (username === 'manager') handleLogin('MANAGER', 'Pak Manager');
    else alert('Username tidak ditemukan! Coba: admin, kasir, atau manager');
  };

  return (
    <div className="min-h-screen bg-neo-bg flex flex-col md:flex-row font-sans">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black mb-2">
              POS<span className="text-neo-primary">System</span>
            </h1>
            <p className="font-bold uppercase text-black/50 text-xl tracking-tight">Silakan masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleFormLogin} className="space-y-6">
            <div>
              <label className="block font-black uppercase text-sm mb-2 text-black">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-black stroke-[3px]" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin / kasir / manager"
                  className="w-full pl-12 pr-4 py-4 border-[3px] border-black text-black font-black bg-white focus:outline-none focus:bg-[#EED9B9] focus:shadow-[4px_4px_0px_0px_#000] focus:-translate-y-1 focus:-translate-x-1 transition-all uppercase placeholder:text-black/30 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2 text-black">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-black stroke-[3px]" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="***"
                  className="w-full pl-12 pr-4 py-4 border-[3px] border-black text-black font-black bg-white focus:outline-none focus:bg-[#EED9B9] focus:shadow-[4px_4px_0px_0px_#000] focus:-translate-y-1 focus:-translate-x-1 transition-all uppercase placeholder:text-black/30 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-white bg-[#D53E0F] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase text-xl mt-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 rounded-xl"
            >
              Masuk <ArrowRight size={20} className="stroke-[3px]" />
            </button>
          </form>
        </div>
      </div>

      {/* Kanan: Fast Login Roles */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#EED9B9]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black border-b-[4px] border-black pb-2 inline-block">Login Cepat / Role Demo</h2>
          </div>

          <button onClick={() => handleLogin('ADMIN', 'Super Admin')} className="w-full neo-card flex items-center gap-4 hover:bg-[#D53E0F] hover:text-white transition-colors group cursor-pointer text-left rounded-xl">
            <div className="p-3 bg-black text-[#EED9B9] border-[3px] border-black shadow-[2px_2px_0px_0px_#000] group-hover:bg-white group-hover:text-black transition-colors rounded-xl">
              <ShieldCheck size={28} className="stroke-[3px]" />
            </div>
            <div>
              <h3 className="font-black uppercase text-xl">Admin (Superuser)</h3>
              <p className="font-bold text-sm opacity-70">Akses semua fitur, pengaturan, dan master data.</p>
            </div>
          </button>

          <button onClick={() => handleLogin('MANAGER', 'Pak Manager')} className="w-full neo-card flex items-center gap-4 hover:bg-[#A8E6CF] transition-colors group cursor-pointer text-left rounded-xl">
            <div className="p-3 bg-black text-[#EED9B9] border-[3px] border-black shadow-[2px_2px_0px_0px_#000] group-hover:bg-white group-hover:text-black transition-colors rounded-xl">
              <BarChart size={28} className="stroke-[3px]" />
            </div>
            <div>
              <h3 className="font-black uppercase text-xl">Manager Outlet</h3>
              <p className="font-bold text-sm opacity-70">Akses laporan, mutasi stok, dan dashboard.</p>
            </div>
          </button>

          <button onClick={() => handleLogin('KASIR', 'Budi Kasir')} className="w-full neo-card flex items-center gap-4 hover:bg-[#CCFF00] transition-colors group cursor-pointer text-left rounded-xl">
            <div className="p-3 bg-black text-[#EED9B9] border-[3px] border-black shadow-[2px_2px_0px_0px_#000] group-hover:bg-white group-hover:text-black transition-colors rounded-xl">
              <ShoppingCart size={28} className="stroke-[3px]" />
            </div>
            <div>
              <h3 className="font-black uppercase text-xl">Kasir</h3>
              <p className="font-bold text-sm opacity-70">Fokus pada halaman POS (Point of Sales) transaksi.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
