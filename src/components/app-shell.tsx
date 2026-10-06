import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (cancelled) return;
      setUserName(profile?.full_name || user.email || "Pengguna");
      const primary = roles?.[0]?.role;
      setRole(
        primary === "admin"
          ? "Admin"
          : primary === "warehouse_manager"
            ? "Manajer Gudang"
            : primary === "owner"
              ? "Pemilik"
              : "Kasir",
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-16 shrink-0 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border-[3px] border-white bg-primary">
            <Store className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base leading-tight">POS</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
              Multi-Lokasi
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 rounded-lg p-1 hover:bg-white/10 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition-colors",
                  active
                    ? "bg-white text-foreground"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon size={17} className={active ? "text-primary" : ""} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative shrink-0 border-t border-white/10 bg-black/20 p-3">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/20"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-foreground">
              {userName ? userName.substring(0, 2).toUpperCase() : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{userName || "…"}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                {role || "…"}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={cn("shrink-0 transition-transform", profileOpen && "rotate-180")}
            />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute bottom-[calc(100%+8px)] left-3 right-3 z-50 rounded-2xl border-[3px] border-foreground bg-card py-2 shadow-brutal">
                <div className="border-b-2 border-muted px-4 pb-2.5">
                  <p className="truncate text-sm font-bold text-foreground">{userName}</p>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-primary">
                    {role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-accent transition-colors hover:bg-muted"
                >
                  <LogOut size={15} /> Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b-[3px] border-foreground bg-card px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="font-display text-sm">
              {NAV_ITEMS.find((n) => n.to === pathname)?.label ?? "POS"}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden rounded-lg border-2 border-foreground bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground sm:block">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-5 py-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
