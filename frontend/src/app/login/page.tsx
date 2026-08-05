'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  BarChart3,
  Building2,
  TrendingUp,
  Boxes,
  Receipt
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleLogin = (role: string, name: string) => {
    setIsLoading(true);
    localStorage.setItem('pos_role', role);
    localStorage.setItem('pos_user_name', name);

    setTimeout(() => {
      if (role === 'KASIR') {
        router.push('/pos');
      } else {
        router.push('/dashboard');
      }
    }, 400);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser === 'admin') handleLogin('ADMIN', 'Super Admin');
    else if (cleanUser === 'kasir') handleLogin('KASIR', 'Budi Kasir');
    else if (cleanUser === 'manager') handleLogin('MANAGER', 'Pak Manager');
    else if (cleanUser.length > 0) handleLogin('ADMIN', username);
    else alert('Masukkan username atau pilih salah satu peran di bawah');
  };

  const selectQuickRole = (role: string, userVal: string) => {
    setSelectedRole(role);
    setUsername(userVal);
    setPassword('••••••••');
  };

  const roles = [
    {
      role: 'ADMIN',
      username: 'admin',
      label: 'Super Admin',
      icon: ShieldCheck,
    },
    {
      role: 'MANAGER',
      username: 'manager',
      label: 'Manager Toko',
      icon: BarChart3,
    },
    {
      role: 'KASIR',
      username: 'kasir',
      label: 'Kasir POS',
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="min-h-screen flex font-sans bg-slate-950 overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* LEFT PANEL: Clean Professional Branding & Features */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-16 bg-slate-950 text-white border-r border-slate-800/80">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
            <img src="/logo_color.png" alt="POS Logo" className="h-6 w-auto object-contain brightness-0 invert" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-mono">
            POS SYSTEM
          </span>
        </div>

        {/* Center Pitch & Minimal Metrics Card */}
        <div className="relative z-10 my-auto max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Sistem Point of Sale <br />
            <span className="text-orange-400">Multi-Lokasi</span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Platform manajemen toko dan transaksi kasir terpusat. Pantau penjualan, kelola stok barang, dan operasionalkan multi-cabang bisnis Anda secara efisien.
          </p>

          {/* Minimal Feature Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
              <Building2 size={20} className="text-orange-400 mb-2" />
              <p className="text-sm font-semibold text-slate-200">Multi-Cabang</p>
              <p className="text-xs text-slate-400 mt-1">Sinkronisasi instan antar lokasi</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
              <Boxes size={20} className="text-orange-400 mb-2" />
              <p className="text-sm font-semibold text-slate-200">Kelola Stok</p>
              <p className="text-xs text-slate-400 mt-1">Mutasi & inventori otomatis</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
              <Receipt size={20} className="text-orange-400 mb-2" />
              <p className="text-sm font-semibold text-slate-200">Kasir Cepat</p>
              <p className="text-xs text-slate-400 mt-1">Antarmuka transaksi efisien</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500">
          © 2026 POS System Enterprises Ltd. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Clean Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 xl:p-16 bg-white min-h-screen">
        
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-3 pb-6 mb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <img src="/logo_color.png" alt="POS Logo" className="h-5 w-auto object-contain brightness-0 invert" />
          </div>
          <span className="text-lg font-bold text-slate-900 font-mono">POS SYSTEM</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[400px] mx-auto my-auto py-4">
          
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Masuk ke Akun
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Pilih akun demo di bawah atau masukkan kredensial Anda.
            </p>
          </div>

          {/* QUICK DEMO ROLE BUTTONS */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-500 mb-2.5">
              Akses Cepat Demo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role || username.toLowerCase() === item.username;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => selectQuickRole(item.role, item.username)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 text-orange-950 ring-1 ring-orange-500'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon size={18} className={isSelected ? 'text-orange-600 mb-1.5' : 'text-slate-500 mb-1.5'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">atau login manual</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setSelectedRole(null);
                  }}
                  placeholder="admin / kasir / manager"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-orange-600 hover:underline">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600">
                  Ingat saya
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md active:scale-[0.99] transition-all duration-150 mt-4 flex justify-center items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-medium">
          <p>© 2026 POS System Enterprises Ltd.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Bantuan</a>
          </div>
        </div>

      </div>
    </div>
  );
}
