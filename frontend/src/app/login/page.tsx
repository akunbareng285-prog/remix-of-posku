'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, ShieldCheck, ShoppingCart, BarChart3, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: string, name: string) => {
    setIsLoading(true);
    localStorage.setItem('pos_role', role);
    localStorage.setItem('pos_user_name', name);

    setTimeout(() => {
      if (role === 'KASIR') {
        router.push('/pos');
      } else {
        router.push('/');
      }
    }, 400);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin') handleLogin('ADMIN', 'Super Admin');
    else if (username === 'kasir') handleLogin('KASIR', 'Budi Kasir');
    else if (username === 'manager') handleLogin('MANAGER', 'Pak Manager');
    else alert('Username tidak ditemukan! Coba: admin, kasir, atau manager');
  };

  const roleCards = [
    {
      role: 'ADMIN',
      name: 'Super Admin',
      label: 'Admin',
      sublabel: 'Akses penuh ke semua fitur, pengaturan, dan master data.',
      icon: ShieldCheck,
      bgColor: 'bg-indigo-500',
      bg: 'bg-indigo-50 hover:bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      role: 'MANAGER',
      name: 'Pak Manager',
      label: 'Manager',
      sublabel: 'Akses laporan, mutasi stok, dan dashboard.',
      icon: BarChart3,
      bgColor: 'bg-emerald-500',
      bg: 'bg-emerald-50 hover:bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      role: 'KASIR',
      name: 'Budi Kasir',
      label: 'Kasir',
      sublabel: 'Fokus pada halaman POS untuk transaksi.',
      icon: ShoppingCart,
      bgColor: 'bg-amber-500',
      bg: 'bg-amber-50 hover:bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      {/* Left: Abstract Graphic Presentation */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden flex-col items-center justify-center p-12 xl:p-16">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

        {/* Decorative Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 z-0"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 z-0"></div>

        {/* Top Logo */}
        <div className="absolute top-12 left-12 xl:top-16 xl:left-16 flex items-center gap-3 z-20">
          <img src="/logo_color.png" alt="POS Logo" className="h-9 w-auto object-contain drop-shadow-md" />
          <p className="text-xl font-black text-white tracking-widest uppercase drop-shadow-md">POS SYSTEM</p>
        </div>

        {/* Center Content */}
        <div className="relative z-10 w-full max-w-xl animate-fade-in -mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm text-slate-200 text-xs font-bold uppercase tracking-wider mb-8 shadow-lg">
            <Sparkles size={14} className="text-primary" /> Solusi Terpadu & Terpercaya
          </div>
          <h1 className="text-[3.5rem] xl:text-[4.2rem] font-black text-white leading-[1.1] mb-6 tracking-tight">
            Tingkatkan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-primary drop-shadow-sm">Efisiensi Bisnis</span>
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md">Sistem Point of Sale modern untuk mengelola inventori, memantau penjualan, dan mengoperasionalkan multi-lokasi bisnis Anda secara instan dan akurat.</p>

          <div className="mt-12 flex items-center gap-5">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 flex items-center justify-center bg-slate-700 text-slate-300 z-10">
                  <User size={16} />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-slate-300">
              Dipercaya oleh <span className="text-white font-bold">500+</span> bisnis
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form (White Background) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 relative z-10 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.05)] rounded-l-3xl lg:-ml-6 my-0 lg:my-0 lg:rounded-none lg:shadow-none">
        {/* Mobile Top Logo (Hidden on Desktop) */}
        <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
          <img src="/logo_color.png" alt="POS Logo" className="h-8 w-auto object-contain" />
          <p className="text-xl font-bold text-slate-800 tracking-tight">POS System</p>
        </div>

        {/* Center Form */}
        <div className="w-full max-w-[400px] mx-auto my-auto animate-fade-in py-8">
          <h1 className="text-[2.5rem] font-bold text-primary tracking-tight mb-2 text-left">Login</h1>
          <p className="text-slate-500 text-sm text-left mb-8">Welcome! Login to manage your team and operations effectively.</p>

          <form onSubmit={handleFormLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin / kasir / manager"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  <Lock size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm text-slate-600">Remember Me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                Forgot Your Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(255,140,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,140,0,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-6 flex justify-center items-center"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Log In'}
            </button>
          </form>

          {/* Or Login With Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-slate-400 font-medium">Or Login With</span>
            </div>
          </div>

          {/* Demo Mode Buttons (Instead of Google/Apple) */}
          <div className="mt-6 flex justify-center gap-3">
            {roleCards.map((card) => (
              <button
                key={card.role}
                onClick={() => handleLogin(card.role, card.name)}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 py-2.5 px-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                title={`Login cepat sebagai ${card.label}`}
              >
                <card.icon size={16} className={card.iconColor} />
                <span className="text-xs font-semibold text-slate-700">{card.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-10">
            Don't Have An Account?{' '}
            <a href="#" className="font-bold text-primary hover:underline">
              Register Now.
            </a>
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <p>Copyright © 2026 POS System Enterprises LTD.</p>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
