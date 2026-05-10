import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  MapPin,
  LogOut,
  Tag,
  Users,
  Receipt,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "Kasir", icon: ShoppingCart, highlight: true },
  { to: "/transactions", label: "Transaksi", icon: Receipt },
  { to: "/reports", label: "Laporan", icon: BarChart3 },
  { to: "/products", label: "Produk", icon: Package },
  { to: "/categories", label: "Kategori", icon: Tag },
  { to: "/stock", label: "Stok", icon: Warehouse },
  { to: "/locations", label: "Lokasi", icon: MapPin },
  { to: "/users", label: "Pengguna", icon: Users, adminOnly: true },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut, hasRole } = useAuth();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:flex flex-col border-r-2 border-foreground">
      <div className="px-5 py-6 border-b-2 border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-md bg-accent text-accent-foreground border-2 border-sidebar-border flex items-center justify-center font-display text-xl shadow-[3px_3px_0_0_var(--sidebar-border)]">
            T
          </div>
          <div>
            <div className="font-display uppercase text-lg leading-none">Toko POS</div>
            <div className="text-xs opacity-70 mt-1 font-medium">Multi-lokasi</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {items.filter(i => !i.adminOnly || hasRole("admin")).map(({ to, label, icon: Icon, highlight }) => {
          const active = path === to || (to !== "/dashboard" && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-all border-2",
                active
                  ? "bg-accent text-accent-foreground border-sidebar-border shadow-[3px_3px_0_0_var(--sidebar-border)] -translate-x-[1px] -translate-y-[1px]"
                  : "border-transparent hover:bg-sidebar-accent text-sidebar-foreground/90 hover:border-sidebar-border",
                highlight && !active && "border-sidebar-border/60"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t-2 border-sidebar-border">
        <div className="px-3 py-2 text-xs opacity-70 truncate font-medium">{user?.email}</div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide border-2 border-transparent hover:bg-sidebar-accent hover:border-sidebar-border transition-all"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}