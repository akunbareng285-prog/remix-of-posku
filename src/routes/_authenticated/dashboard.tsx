import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertTriangle, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Toko POS" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [{ count: productCount }, { data: txToday }, { data: lowStock }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("final_price").gte("created_at", today.toISOString()),
        supabase
          .from("product_stocks")
          .select("quantity, products!inner(name, min_stock_level), locations(name)")
          .order("quantity"),
      ]);
      const todayTotal = (txToday ?? []).reduce((s, t) => s + Number(t.final_price), 0);
      const todayCount = (txToday ?? []).length;
      const low = (lowStock ?? []).filter(
        (s: any) => s.quantity <= (s.products?.min_stock_level ?? 5)
      );
      return { productCount: productCount ?? 0, todayTotal, todayCount, low };
    },
  });

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={format(new Date(), "EEEE, d MMMM yyyy")} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={DollarSign} label="Penjualan hari ini" value={formatRupiah(stats?.todayTotal ?? 0)} bg="bg-primary" fg="text-primary-foreground" />
          <StatCard icon={ShoppingCart} label="Transaksi hari ini" value={String(stats?.todayCount ?? 0)} bg="bg-accent" fg="text-accent-foreground" />
          <StatCard icon={Package} label="Total produk" value={String(stats?.productCount ?? 0)} bg="bg-card" fg="text-foreground" />
          <StatCard icon={AlertTriangle} label="Stok tipis" value={String(stats?.low.length ?? 0)} bg="bg-warning" fg="text-warning-foreground" />
        </div>

        <section className="nb-card p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-foreground">
            <div className="flex items-center gap-3">
              <div className="nb-border bg-warning p-2"><AlertTriangle className="h-5 w-5" /></div>
              <h2 className="text-xl font-display uppercase">Peringatan Stok Tipis</h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground/60">Di bawah batas minimum</span>
          </div>
          {(stats?.low ?? []).length === 0 ? (
            <div className="flex items-center gap-3 p-6 bg-success/20 nb-border">
              <TrendingUp className="h-5 w-5" />
              <p className="font-bold uppercase">Semua stok aman.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stats!.low.slice(0, 8).map((s: any, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-4 nb-border bg-background">
                  <div className="min-w-0">
                    <div className="font-bold truncate">{s.products?.name}</div>
                    <div className="text-xs uppercase tracking-wider text-foreground/60 mt-0.5">{s.locations?.name}</div>
                  </div>
                  <span className="shrink-0 nb-border bg-warning px-3 py-1 text-xs font-black uppercase">
                    Sisa {s.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  bg,
  fg,
}: {
  icon: any;
  label: string;
  value: string;
  bg: string;
  fg: string;
}) {
  return (
    <div className={`${bg} ${fg} nb-border nb-shadow nb-press p-5 rounded-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="nb-border bg-background text-foreground p-2">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-3xl font-display mt-1 break-words">{value}</div>
    </div>
  );
}
