'use client';

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ArrowRightLeft,
  FileBarChart,
  Settings,
  LogOut,
  Store,
  Users,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  Layers,
  PackageCheck,
  Truck,
  Tag,
  Receipt,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: string[];
}
interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string | null) => {
    if (!label) return;
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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

  const navGroups: NavGroup[] = [
    {
      label: null,
      items: [{ href: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'MANAGER'] }],
    },
    {
      label: 'Inventori',
      items: [
        { href: '/products', icon: Package, label: 'Produk', roles: ['ADMIN', 'MANAGER'] },
        { href: '/stock-locations', icon: Layers, label: 'Stok & Lokasi', roles: ['ADMIN', 'MANAGER'] },
        { href: '/barang-masuk', icon: PackageCheck, label: 'Barang Masuk', roles: ['ADMIN', 'MANAGER'] },
        { href: '/transfer-stok', icon: ArrowRightLeft, label: 'Transfer Stok', roles: ['ADMIN', 'MANAGER'] },
      ],
    },
    {
      label: 'Laporan',
      items: [
        { href: '/transactions', icon: Receipt, label: 'Transaksi', roles: ['ADMIN', 'MANAGER'] },
        { href: '/mutations', icon: ArrowRightLeft, label: 'Mutasi Stok', roles: ['ADMIN', 'MANAGER'] },
        { href: '/reports', icon: FileBarChart, label: 'Laporan', roles: ['ADMIN', 'MANAGER'] },
        { href: '/promotions', icon: Tag, label: 'Promosi', roles: ['ADMIN'] },
      ],
    },
    {
      label: 'Master Data',
      items: [
        { href: '/suppliers', icon: Truck, label: 'Supplier', roles: ['ADMIN'] },
        { href: '/stores', icon: MapPin, label: 'Lokasi', roles: ['ADMIN'] },
        { href: '/users', icon: Users, label: 'Pengguna', roles: ['ADMIN'] },
        { href: '/settings', icon: Settings, label: 'Pengaturan', roles: ['ADMIN'] },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;

  const NavLink = ({ href, icon: Icon, label }: NavItem) => (
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 rounded-xl text-[13px] font-semibold transition-all duration-200 group relative
        ${isActive(href) ? 'bg-white text-primary shadow-md shadow-black/10' : 'text-white/80 hover:text-white hover:bg-white/10'}
        ${isCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3.5 py-2.5 w-full'}
      `}
      title={isCollapsed ? label : undefined}
    >
      <Icon size={isCollapsed ? 18 : 17} className={`shrink-0 transition-all ${isActive(href) ? 'text-primary' : 'text-white/60 group-hover:text-white'}`} />
      {!isCollapsed && (
        <>
          <span className="truncate">{label}</span>
          {isActive(href) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
        </>
      )}
    </Link>
  );

  return (
    <div className="flex h-screen bg-transparent overflow-hidden relative">
      <div className="mesh-bg" />

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-10
        ${isCollapsed ? 'w-[88px]' : 'w-[240px]'} bg-slate-950 flex flex-col shrink-0
        border-r border-slate-900 shadow-[4px_0_24px_rgba(0,0,0,0.25)]
        transition-all duration-300 ease-out text-white
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        {/* Logo */}
        <div className={`flex h-[88px] items-center ${isCollapsed ? 'justify-center' : 'px-6 gap-3.5'} shrink-0 relative`}>
          {isCollapsed ? (
            <img src="/logo_color.png" alt="Logo" className="w-12 h-12 object-contain" />
          ) : (
            <>
              <img src="/logo_color.png" alt="Logo" className="h-12 w-auto object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black text-white tracking-tight leading-tight truncate">POS System</p>
                <p className="text-[11px] text-white/70 font-bold tracking-[0.15em] uppercase truncate mt-0.5">Multi-Location</p>
              </div>
            </>
          )}
          <button onClick={() => setSidebarOpen(false)} className="absolute right-4 lg:hidden p-1.5 bg-white/10 rounded-lg hover:bg-white/20">
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto sidebar-scroll space-y-1 ${isCollapsed ? 'px-3 py-4' : 'px-4 py-4'}`}>
          {navGroups.map((group, gi) => {
            const items = group.items.filter((i) => i.roles.includes(role!));
            if (!items.length) return null;
            const isGroupCollapsed = group.label && collapsedGroups[group.label];

            return (
              <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
                {group.label && !isCollapsed && (
                  <button onClick={() => toggleGroup(group.label)} className="w-full flex items-center justify-between px-3 pt-2 pb-1.5 hover:bg-white/5 rounded-lg transition-colors group/btn mb-1">
                    <p className="text-[9.5px] font-bold text-white/60 group-hover/btn:text-white/90 uppercase tracking-[0.12em] transition-colors">{group.label}</p>
                    <ChevronDown size={14} className={`text-white/40 group-hover/btn:text-white/70 transition-all duration-300 ${isGroupCollapsed ? '-rotate-90' : ''}`} />
                  </button>
                )}
                {group.label && isCollapsed && <div className="w-full border-t border-white/20 my-3" />}
                <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isGroupCollapsed && !isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                  {items.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className={`p-4 relative shrink-0 border-t border-white/5 bg-black/20 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center ${isCollapsed ? 'justify-center p-0 w-10 h-10' : 'w-full gap-3 px-3.5 py-2.5'} rounded-xl bg-white/10 hover:bg-white/20 transition-all text-left`}
            title={isCollapsed ? userName || '' : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-primary shrink-0 shadow-sm">{userName?.substring(0, 2).toUpperCase() || 'AD'}</div>
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{userName}</p>
                  <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">{role}</p>
                </div>
                <ChevronDown size={14} className={`text-white/60 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setProfileOpen(false)} />
              <div className={`absolute bottom-[calc(100%+8px)] ${isCollapsed ? 'left-14' : 'left-4 right-4'} w-[214px] bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-[101] animate-scale-in`}>
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-text-primary">{userName}</p>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wide mt-0.5">{role}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                  <LogOut size={15} /> Keluar Aplikasi
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 z-10">
        <header className="h-14 flex items-center justify-between px-5 lg:px-7 bg-white/60 backdrop-blur-xl border-b border-white shadow-sm z-20 shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
              <Menu size={20} />
            </button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Cari produk atau transaksi..."
                className="w-full pl-10 pr-4 py-2 bg-white/70 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-white rounded-xl text-xs text-text-secondary font-medium">
              {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <button className="relative p-2 text-text-secondary hover:text-primary bg-white/60 border border-white rounded-xl transition-all hover:scale-105">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-white" />
            </button>
            <Link href="/pos" className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/25 hover:-translate-y-0.5 transition-all">
              <ShoppingCart size={15} />
              <span className="hidden sm:block">Buka Kasir</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="px-5 py-6 md:px-8 lg:px-10 xl:px-12 xl:py-8 w-full pb-14">{children}</div>
        </main>
      </div>
    </div>
  );
}
