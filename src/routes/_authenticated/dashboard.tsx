import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Boxes,
  Package,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — POS Multi-Lokasi" },
      {
        name: "description",
        content: "Ringkasan penjualan hari ini, stok menipis, dan transaksi terbaru.",
      },
      { property: "og:title", content: "Dashboard — POS Multi-Lokasi" },
      {
        property: "og:description",
        content: "Ringkasan penjualan hari ini, stok menipis, dan transaksi terbaru.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const todayISO = format(new Date(), "yyyy-MM-dd'T'00:00:00");

  const { data: todaySales } = useQuery({
    queryKey: ["dashboard", "today-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("final_price")
        .gte("created_at", todayISO);
      if (error) throw error;
      const total = (data ?? []).reduce((s, t) => s + Number(t.final_price ?? 0), 0);
      return { total, count: data?.length ?? 0 };
    },
  });

  const { data: productCount } = useQuery({
    queryKey: ["dashboard", "product-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: lowStock } = useQuery({
    queryKey: ["dashboard", "low-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_stocks")
        .select(
          "quantity, product:products(name, unit, min_stock_level), location:locations(name)",
        )
        .order("quantity", { ascending: true })
        .limit(100);
      if (error) throw error;
      return (data ?? []).filter(
        (r) =>
          r.product && r.quantity < Number(r.product.min_stock_level ?? 0) + 1,
      );
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["dashboard", "recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, transaction_code, final_price, payment_method, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const stats = [
    {
      icon: TrendingUp,
      label: "Penjualan Hari Ini",
      value: formatRupiah(todaySales?.total ?? 0),
      bg: "bg-success",
      iconColor: "text-success-foreground",
    },
    {
      icon: ReceiptText,
      label: "Transaksi Hari Ini",
      value: String(todaySales?.count ?? 0),
      bg: "bg-primary",
      iconColor: "text-primary-foreground",
    },
    {
      icon: Package,
      label: "Total Produk",
      value: String(productCount ?? 0),
      bg: "bg-warning",
      iconColor: "text-warning-foreground",
    },
    {
      icon: AlertTriangle,
      label: "Stok Menipis",
      value: String(lowStock?.length ?? 0),
      bg: "bg-accent",
      iconColor: "text-accent-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Dashboard</h1>
        <p className="mt-1 font-medium text-muted-foreground">
          Ringkasan aktivitas penjualan dan stok Anda.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-foreground ${s.bg}`}
              >
                <s.icon className={`h-6 w-6 ${s.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className="truncate font-display text-xl">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" /> Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!lowStock || lowStock.length === 0 ? (
              <p className="text-sm font-medium text-muted-foreground">
                Semua stok aman. Barang masuk dan transfer stok akan tampil di sini.
              </p>
            ) : (
              <ul className="space-y-3">
                {lowStock.slice(0, 6).map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-muted px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{r.product?.name}</p>
                      <p className="truncate text-xs font-semibold text-muted-foreground">
                        {r.location?.name}
                      </p>
                    </div>
                    <Badge variant={r.quantity <= 0 ? "destructive" : "secondary"}>
                      {r.quantity} {r.product?.unit}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" /> Transaksi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recent || recent.length === 0 ? (
              <p className="text-sm font-medium text-muted-foreground">
                Belum ada transaksi. Buka halaman kasir untuk mulai berjualan.
              </p>
            ) : (
              <ul className="space-y-3">
                {recent.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-muted px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{t.transaction_code}</p>
                      <p className="truncate text-xs font-semibold text-muted-foreground">
                        {t.created_at
                          ? format(new Date(t.created_at), "dd MMM yyyy, HH:mm")
                          : ""}
                        {" · "}
                        {t.payment_method}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">
                      {formatRupiah(t.final_price)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
