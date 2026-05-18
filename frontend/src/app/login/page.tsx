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
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left: Abstract Graphic Presentation */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 via-primary to-orange-600 relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        
        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10 pt-4">
          <img src="/logo_white.png" alt="POS Logo" className="h-8 w-auto object-contain brightness-0 invert" />
          <p className="text-xl font-bold text-white tracking-widest uppercase">POS SYSTEM</p>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-lg mb-20 animate-slide-in -mt-10">
          <div className="text-[4rem] xl:text-[5rem] font-bold text-white leading-tight mb-4 tracking-tight" style={{ color: 'white' }}>
            Welcome to...
          </div>
          <p className="text-lg text-white/90 font-medium leading-relaxed mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Sistem Point of Sale terbaik untuk mengelola inventori, memantau penjualan, dan operasionalkan multi-lokasi bisnis Anda dengan sangat mudah, aman, dan efisien.
          </p>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 text-white/80 text-sm font-medium pb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Akses aman khusus untuk tim manajemen & operasional.
        </div>

        {/* Wavy Bottom Abstract Shapes (SVG) */}
        <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
          <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto translate-y-1">
            <path fill="currentColor" fillOpacity="0.2" d="M0,224L60,213.3C120,203,240,181,360,176C480,171,600,181,720,197.3C840,213,960,235,1080,240C1200,245,1320,235,1380,229.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" className="text-white"></path>
            <path fill="currentColor" fillOpacity="0.3" d="M0,160L80,176C160,192,320,224,480,224C640,224,800,192,960,176C1120,160,1280,160,1360,160L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" className="text-white"></path>
          </svg>
        </div>
      </div>

      {/* Right: Login Form (White Background) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 relative z-10 bg-white">
        
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
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Lock size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm text-slate-600">Remember Me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">Forgot Your Password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(255,140,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,140,0,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-6 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Log In'
              )}
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
            {roleCards.map(card => (
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
            Don't Have An Account? <a href="#" className="font-bold text-primary hover:underline">Register Now.</a>
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <p>Copyright © 2026 POS System Enterprises LTD.</p>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
