import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { format, subDays, startOfDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { TrendingUp, ShoppingBag, Receipt, Package, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Laporan — Toko POS" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [days, setDays] = useState(7);

  const { data } = useQuery({
    queryKey: ["reports", days],
    queryFn: async () => {
      const from = startOfDay(subDays(new Date(), days - 1)).toISOString();
      const { data: tx } = await supabase
        .from("transactions")
        .select("id, final_price, created_at")
        .gte("created_at", from)
        .order("created_at", { ascending: true });

      const { data: items } = await supabase
        .from("transaction_items")
        .select("quantity, subtotal, product_id, products(name), transactions!inner(created_at)")
        .gte("transactions.created_at", from);

      // Aggregate per day
      const buckets: Record<string, { date: string; total: number; count: number }> = {};
      for (let i = 0; i < days; i++) {
        const d = format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd");
        buckets[d] = { date: d, total: 0, count: 0 };
      }
      (tx ?? []).forEach((t) => {
        const k = format(new Date(t.created_at), "yyyy-MM-dd");
        if (buckets[k]) {
          buckets[k].total += Number(t.final_price);
          buckets[k].count += 1;
        }
      });

      // Top products
      const productAgg: Record<string, { name: string; qty: number; revenue: number }> = {};
      (items ?? []).forEach((it: any) => {
        const id = String(it.product_id);
        const name = it.products?.name ?? `#${id}`;
        if (!productAgg[id]) productAgg[id] = { name, qty: 0, revenue: 0 };
        productAgg[id].qty += Number(it.quantity);
        productAgg[id].revenue += Number(it.subtotal);
      });
      const topProducts = Object.values(productAgg)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const series = Object.values(buckets);
      const totalRevenue = series.reduce((s, b) => s + b.total, 0);
      const totalTx = series.reduce((s, b) => s + b.count, 0);
      const avgTicket = totalTx ? totalRevenue / totalTx : 0;
      const totalItems = (items ?? []).reduce((s: number, it: any) => s + Number(it.quantity), 0);

      return { series, topProducts, totalRevenue, totalTx, avgTicket, totalItems };
    },
  });

  const maxBar = Math.max(1, ...(data?.series.map((s) => s.total) ?? [1]));

  function exportCSV() {
    if (!data) return;
    const rows = [
      ["Tanggal", "Transaksi", "Pendapatan"],
      ...data.series.map((s) => [s.date, String(s.count), String(s.total)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-${days}hari.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Laporan"
        subtitle={`Ringkasan penjualan ${days} hari terakhir`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4" /> CSV
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Period selector */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "7 hari", v: 7 },
            { label: "14 hari", v: 14 },
            { label: "30 hari", v: 30 },
            { label: "90 hari", v: 90 },
          ].map((o) => (
            <Button
              key={o.v}
              size="sm"
              variant={days === o.v ? "default" : "outline"}
              onClick={() => setDays(o.v)}
            >
              {o.label}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={TrendingUp} label="Pendapatan" value={formatRupiah(data?.totalRevenue ?? 0)} bg="bg-primary" fg="text-primary-foreground" />
          <StatCard icon={Receipt} label="Transaksi" value={String(data?.totalTx ?? 0)} bg="bg-accent" fg="text-accent-foreground" />
          <StatCard icon={ShoppingBag} label="Item terjual" value={String(data?.totalItems ?? 0)} bg="bg-success" fg="text-success-foreground" />
          <StatCard icon={Package} label="Rata2 / transaksi" value={formatRupiah(data?.avgTicket ?? 0)} bg="bg-card" fg="text-foreground" />
        </div>

        {/* Bar chart */}
        <section className="nb-card p-6">
          <h2 className="font-display uppercase text-xl mb-5 pb-4 border-b-2 border-foreground">
            Tren Pendapatan
          </h2>
          {!data || data.series.length === 0 ? (
            <p className="font-bold uppercase text-sm text-foreground/60">Belum ada data.</p>
          ) : (
            <div className="flex items-end gap-2 h-64 overflow-x-auto pb-2">
              {data.series.map((s) => {
                const h = (s.total / maxBar) * 100;
                return (
                  <div key={s.date} className="flex flex-col items-center gap-2 flex-1 min-w-[40px]">
                    <div className="text-[10px] font-mono font-bold">
                      {s.total > 0 ? formatRupiah(s.total).replace("Rp", "").trim() : ""}
                    </div>
                    <div
                      className="w-full bg-primary border-2 border-foreground nb-shadow-sm transition-all"
                      style={{ height: `${Math.max(h, 2)}%`, minHeight: "4px" }}
                      title={`${s.date}: ${formatRupiah(s.total)}`}
                    />
                    <div className="text-[10px] font-bold uppercase whitespace-nowrap">
                      {format(new Date(s.date), "d MMM", { locale: idLocale })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Top products */}
        <section className="nb-card p-6">
          <h2 className="font-display uppercase text-xl mb-5 pb-4 border-b-2 border-foreground">
            Produk Terlaris
          </h2>
          {!data || data.topProducts.length === 0 ? (
            <p className="font-bold uppercase text-sm text-foreground/60">Belum ada data.</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => {
                const max = data.topProducts[0].revenue;
                const w = (p.revenue / max) * 100;
                return (
                  <div key={p.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 flex items-center justify-center bg-accent border-2 border-foreground nb-shadow-sm font-display">
                          {i + 1}
                        </span>
                        <span className="uppercase">{p.name}</span>
                      </div>
                      <span className="font-mono">{formatRupiah(p.revenue)} · {p.qty}x</span>
                    </div>
                    <div className="h-3 nb-border bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, bg, fg,
}: { icon: any; label: string; value: string; bg: string; fg: string }) {
  return (
    <div className={`nb-card p-5 ${bg} ${fg}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
        <div className="h-9 w-9 rounded-md border-2 border-foreground bg-background text-foreground flex items-center justify-center nb-shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="font-display text-2xl">{value}</div>
    </div>
  );
}
