import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Package, AlertTriangle, ShoppingCart, DollarSign } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Penjualan hari ini" value={formatRupiah(stats?.todayTotal ?? 0)} accent />
          <StatCard icon={ShoppingCart} label="Transaksi hari ini" value={String(stats?.todayCount ?? 0)} />
          <StatCard icon={Package} label="Total produk" value={String(stats?.productCount ?? 0)} />
          <StatCard icon={AlertTriangle} label="Stok tipis" value={String(stats?.low.length ?? 0)} warn />
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Peringatan Stok Tipis</h2>
            <span className="text-xs text-muted-foreground">Di bawah batas minimum</span>
          </div>
          {(stats?.low ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Semua stok aman.</p>
          ) : (
            <div className="divide-y">
              {stats!.low.slice(0, 8).map((s: any, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.products?.name}</div>
                    <div className="text-xs text-muted-foreground">{s.locations?.name}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/20 text-foreground">
                    Sisa {s.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  warn,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            accent
              ? "bg-[var(--gradient-primary)] text-primary-foreground"
              : warn
                ? "bg-warning/20 text-foreground"
                : "bg-secondary text-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}