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
  const canSeeProducts = ['ADMIN'].includes(role);
  const canSeeMutations = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeReports = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeSettings = ['ADMIN'].includes(role);

  const navItems = [
    ...(canSeeDashboard ? [{ href: '/', icon: LayoutDashboard, label: 'Dashboard' }] : []),
    { href: '/pos', icon: ShoppingCart, label: 'Kasir (POS)' },
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
        ${isActive(href)
          ? 'bg-primary text-white shadow-lg shadow-primary/25'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
        }`}
    >
      <Icon size={18} className={`transition-colors ${isActive(href) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
      <span>{label}</span>
      {isActive(href) && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
      )}
    </Link>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[260px] bg-sidebar-bg flex flex-col
        border-r border-white/[0.06]
        transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg shadow-primary/25">
            <ShoppingCart size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">POS System</h1>
            <p className="text-[10px] text-slate-500 font-medium">Multi-Location</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Menu Utama</p>
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {settingsItems.length > 0 && (
            <>
              <div className="my-4 mx-3 border-t border-white/[0.06]" />
              <p className="px-3 py-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Pengaturan</p>
              {settingsItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </>
          )}
        </nav>

        {/* User section at bottom */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {userName?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 font-medium">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white border-b border-card-border z-10 shrink-0">
          {/* Left: Mobile menu + Search */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="pro-input pl-9 py-2 text-sm"
              />
            </div>
          </div>

          {/* Right: Date, Notifications, Profile */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <span className="hidden lg:block text-xs text-text-muted font-medium">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>

            <div className="hidden lg:block w-px h-6 bg-card-border" />

            {/* Notification */}
            <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center text-xs font-bold text-white">
                  {userName?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-text-primary leading-tight">{userName}</p>
                  <p className="text-[10px] text-text-muted">{role}</p>
                </div>
                <ChevronDown size={14} className="text-text-muted hidden sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-card-border shadow-lg py-1 z-40 animate-scale-in">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background px-4 py-4 lg:px-5 lg:py-5">
          <div className="w-full pb-8 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
