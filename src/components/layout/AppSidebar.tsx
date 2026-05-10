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
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "Kasir", icon: ShoppingCart, highlight: true },
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
    <aside className="w-60 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:flex flex-col">
      <div className="px-5 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center font-bold">
            T
          </div>
          <div>
            <div className="font-bold leading-tight">Toko POS</div>
            <div className="text-xs opacity-70">Multi-lokasi</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.filter(i => !i.adminOnly || hasRole("admin")).map(({ to, label, icon: Icon, highlight }) => {
          const active = path === to || (to !== "/dashboard" && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "hover:bg-sidebar-accent text-sidebar-foreground/85",
                highlight && !active && "ring-1 ring-sidebar-primary/40"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="px-3 py-2 text-xs opacity-70 truncate">{user?.email}</div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}