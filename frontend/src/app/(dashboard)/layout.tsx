'use client';

import { LayoutDashboard, ShoppingCart, Package, ArrowRightLeft, FileBarChart, Settings, LogOut, Store, Users, Bell, Search, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('pos_role');
    const savedName = localStorage.getItem('pos_user_name');
    if (!savedRole) {
      router.push('/login');
    } else if (savedRole === 'KASIR') {
      router.push('/pos'); // Kasir dilarang masuk dashboard
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

  if (!role) return null; // Wait for mounting/checking

  const canSeeDashboard = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeProducts = ['ADMIN'].includes(role);
  const canSeeMutations = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeReports = ['ADMIN', 'MANAGER'].includes(role);
  const canSeeSettings = ['ADMIN'].includes(role);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = 'flex items-center gap-3 px-3 py-2 font-bold uppercase transition-colors rounded-xl text-sm';

    if (isActive) {
      return 'flex items-center gap-3 px-4 py-3 bg-[#FFC107] text-black border-[3px] border-black font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px] rounded-xl';
    }
    return `${baseClass} text-white hover:bg-black/20`;
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar: Dark Navy (#111827) for solid pillar feel */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col transition-all border-r-[3px] border-black z-20 shrink-0">
        <div className="flex h-20 items-center justify-center px-6 border-b-[4px] border-black bg-[#111827]">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white">
            POS <span className="text-neo-primary">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          {canSeeDashboard && (
            <Link href="/" className={getLinkClass('/')}>
              <LayoutDashboard size={20} className="stroke-[3px]" />
              Dashboard
            </Link>
          )}

          <Link href="/pos" className={getLinkClass('/pos')}>
            <ShoppingCart size={20} className="stroke-[2px]" />
            Kasir (POS)
          </Link>

          {canSeeProducts && (
            <Link href="/products" className={getLinkClass('/products')}>
              <Package size={20} className="stroke-[2px]" />
              Produk Master
            </Link>
          )}

          {canSeeMutations && (
            <Link href="/mutations" className={getLinkClass('/mutations')}>
              <ArrowRightLeft size={20} className="stroke-[2px]" />
              Mutasi Stok
            </Link>
          )}

          {canSeeReports && (
            <Link href="/reports" className={getLinkClass('/reports')}>
              <FileBarChart size={20} className="stroke-[2px]" />
              Laporan
            </Link>
          )}

          {canSeeSettings && (
            <div className="pt-4 border-t-[3px] border-black/20 space-y-4">
              <Link href="/stores" className={getLinkClass('/stores')}>
                <Store size={20} className="stroke-[2px]" />
                Atur Toko
              </Link>
              <Link href="/users" className={getLinkClass('/users')}>
                <Users size={20} className="stroke-[2px]" />
                Pegawai & Role
              </Link>
              <Link href="/settings" className={getLinkClass('/settings')}>
                <Settings size={20} className="stroke-[2px]" />
                Pengaturan
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 border-t-[3px] border-black">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-3 bg-black text-white font-bold uppercase border-2 border-black hover:bg-[#FF3366] hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] rounded-xl"
          >
            <LogOut size={20} className="stroke-[3px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative z-10 min-w-0">
        {/* Header with Hard Shadows and Thick Borders -> Adapted to the new reference elements */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-8 bg-white border-b-[4px] border-black z-10 w-full shadow-[0px_4px_0px_0px_#000]">
          {/* Left section: Search & Date */}
          <div className="flex items-center gap-4 lg:gap-6 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-black stroke-[3px]" size={20} />
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="pl-10 pr-4 py-2 border-[3px] border-black text-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all w-48 md:w-64 rounded-xl"
              />
            </div>

            <div className="hidden lg:flex items-center gap-2 font-bold uppercase text-black">
              <Calendar size={20} className="stroke-[3px]" />
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Right section: Badges & Profile */}
          <div className="flex items-center gap-4 lg:gap-6 ml-auto shrink-0">
            {/* Brutalist Alert Badge */}
            <div className="flex items-center gap-2 text-sm font-black uppercase text-white bg-[#FF3366] border-[3px] border-black px-3 py-2 cursor-pointer shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-xl">
              <Bell size={18} className="stroke-[3px]" />
              <span className="hidden md:inline">5 Notif</span>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-8 w-[3px] bg-black/20"></div>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="font-black text-black uppercase leading-none text-sm group-hover:text-[#5644FF] transition-colors">{userName}</p>
                <p className="text-[11px] font-bold text-[#5644FF] uppercase mt-1">{role === 'ADMIN' ? 'Pejuang Cuan' : 'Pejuang Hemat'}</p>
              </div>
              <div className="h-11 w-11 bg-[#5644FF] text-white flex items-center justify-center font-black text-lg border-[3px] border-black shadow-[4px_4px_0px_0px_#000] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all rounded-xl">
                {userName?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
          <div className="w-full pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
