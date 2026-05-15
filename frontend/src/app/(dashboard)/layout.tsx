'use client';

import {
  LayoutDashboard, ShoppingCart, Package, ArrowRightLeft,
  FileBarChart, Settings, LogOut, Store, Users, Bell,
  Search, ChevronDown, Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('pos_role');
    const savedName = localStorage.getItem('pos_user_name');
    if (!savedRole) {
      router.push('/login');
    } else if (savedRole === 'KASIR') {
      router.push('/pos');
    } else {
      setRole(savedRole);
      setUserName(savedName || (savedRole === 'ADMIN' ? 'Budi Admin' : 'Siti Manager'));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('pos_role');
    localStorage.removeItem('pos_user_name');
    router.push('/login');
  };

  if (!role) return null;

  const canSeeDashboard = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeProducts = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeMutations = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeReports = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeSettings = ['ADMIN'].includes(role);

  const navItems = [
    ...(canSeeDashboard ? [{ href: '/', icon: LayoutDashboard, label: 'Dashboard' }] : []),
    ...(canSeeProducts ? [{ href: '/products', icon: Package, label: 'Produk Master' }] : []),
    ...(canSeeMutations ? [{ href: '/mutations', icon: ArrowRightLeft, label: 'Mutasi Stok' }] : []),
    ...(canSeeReports ? [{ href: '/reports', icon: FileBarChart, label: 'Laporan' }] : []),
  ];

  const settingsItems = [
    ...(canSeeSettings ? [
      { href: '/stores', icon: Store, label: 'Atur Toko' },
      { href: '/users', icon: Users, label: 'Pegawai & Role' },
      { href: '/settings', icon: Settings, label: 'Pengaturan' },
    ] : []),
  ];

  const isActive = (path: string) => pathname === path;

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group
        ${isActive(href)
          ? 'bg-white text-primary shadow-lg shadow-black/10 translate-x-1'
          : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
    >
      <Icon size={20} className={`transition-colors ${isActive(href) ? 'text-primary' : 'text-white/70 group-hover:text-white'}`} />
      <span>{label}</span>
      {isActive(href) && (
        <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </Link>
  );

  return (
    <div className="flex h-screen bg-transparent overflow-hidden relative">
      {/* Decorative Background */}
      <div className="mesh-bg">
        <div className="mesh-blob-1" />
        <div className="mesh-blob-2" />
        <div className="mesh-blob-3" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-10
        w-[280px] bg-primary flex flex-col
        border-r border-primary-hover shadow-[4px_0_24px_rgba(255,140,0,0.15)]
        transition-transform duration-300 ease-out text-white
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex h-20 items-center gap-4 px-6 border-b border-white/20">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/10">
            <ShoppingCart size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">POS System</h1>
            <p className="text-[11px] text-white/70 font-bold tracking-wider uppercase">Multi-Location</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-extrabold text-white/50 uppercase tracking-widest">Menu Utama</p>
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {settingsItems.length > 0 && (
            <>
              <div className="my-6 mx-4 border-t border-white/10" />
              <p className="px-4 py-2 text-[10px] font-extrabold text-white/50 uppercase tracking-widest">Pengaturan</p>
              {settingsItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </>
          )}
        </nav>

        {/* User section at bottom */}
        <div className="p-4 border-t border-white/20 bg-primary-hover/30 relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 text-left text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-primary shrink-0 shadow-md">
              {userName?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{userName}</p>
              <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">{role}</p>
            </div>
            <ChevronDown size={16} className={`text-white/70 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px]" onClick={() => setProfileOpen(false)} />
              <div className="absolute bottom-[calc(100%-0.5rem)] left-4 w-[248px] bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-40 animate-scale-in">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-text-primary">{userName}</p>
                  <p className="text-xs text-primary font-bold tracking-wider uppercase mb-3">{role}</p>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 p-2.5 rounded-xl border border-white shadow-inner">
                    <Store size={14} className="text-primary" />
                    <span>{role === 'ADMIN' ? 'Semua Cabang (Pusat)' : 'Cabang Depok'}</span>
                  </div>
                </div>
                
                {role === 'ADMIN' && (
                  <>
                    <Link
                      href="/users"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <Users size={16} /> Tambah Akun
                    </Link>
                    <div className="mx-4 my-1 border-t border-slate-100" />
                  </>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} /> Keluar Aplikasi
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 z-10">
        {/* Header - Glassmorphism */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-8 bg-white/60 backdrop-blur-xl border-b border-white shadow-sm z-20 shrink-0">
          {/* Left: Mobile menu + Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 -ml-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-2xl transition-colors bg-white/50 border border-white"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari transaksi atau produk..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/70 backdrop-blur-md border border-white rounded-2xl text-sm font-medium text-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          {/* Right: Date, Notifications, Profile */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/60 border border-white rounded-2xl shadow-sm">
              <span className="text-xs text-text-secondary font-bold">
                {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="hidden lg:block w-px h-8 bg-slate-200/50" />

            {/* Notification */}
            <button className="relative p-2.5 text-text-secondary hover:text-primary hover:bg-primary/10 bg-white/60 border border-white shadow-sm rounded-2xl transition-all duration-200 hover:scale-105">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {/* Kasir Button */}
            <Link
              href="/pos"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:block">Buka Kasir</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 lg:px-10 lg:py-8">
          <div className="w-full pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
