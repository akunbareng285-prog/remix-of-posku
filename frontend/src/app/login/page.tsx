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

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Brand */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <img src="/logo_color.png" alt="POS Logo" className="h-14 w-auto object-contain shrink-0" />
              <div>
                <p className="text-2xl font-black text-text-primary tracking-tight leading-none">POS System</p>
                <p className="text-xs text-text-muted font-bold tracking-[0.15em] uppercase mt-1">Multi-Location</p>
              </div>
            </div>
            <h1 className="text-[1.75rem] font-bold text-text-primary tracking-tight leading-tight">Selamat Datang 👋</h1>
            <p className="page-subtitle">Silakan masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleFormLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin / kasir / manager"
                  className="pro-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pro-input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="pro-button-primary w-full py-3 text-base mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Quick Login */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />

        <div className="w-full max-w-md relative z-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Demo Mode</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-2">Login Cepat</h2>
          <p className="text-sm text-slate-400 mb-8">Pilih role untuk masuk langsung tanpa password</p>

          <div className="space-y-3">
            {roleCards.map((card) => (
              <button
                key={card.role}
                onClick={() => handleLogin(card.role, card.name)}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm
                         hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300 group text-left disabled:opacity-50"
              >
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center shadow-lg shrink-0`}>
                  <card.icon size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="card-title text-white">{card.label}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{card.sublabel}</p>
                </div>
                <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile quick login */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-card-border p-4 safe-area-bottom">
        <p className="text-xs font-medium text-text-muted text-center mb-3">Demo — Login Cepat</p>
        <div className="flex gap-2">
          {roleCards.map((card) => (
            <button
              key={card.role}
              onClick={() => handleLogin(card.role, card.name)}
              disabled={isLoading}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${card.bg} ${card.iconColor}`}
            >
              {card.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
