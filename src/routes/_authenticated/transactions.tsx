import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/format";
import { format } from "date-fns";
import { Receipt, Search, Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [{ title: "Riwayat Transaksi — Toko POS" }] }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const { data: list, isLoading } = useQuery({
    queryKey: ["transactions-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, transaction_code, final_price, payment_method, created_at, location_id, locations(name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (list ?? []).filter((t: any) =>
    !search ||
    t.transaction_code?.toLowerCase().includes(search.toLowerCase()) ||
    t.payment_method?.toLowerCase().includes(search.toLowerCase())
  );

  const { data: detail } = useQuery({
    queryKey: ["transaction-detail", openId],
    enabled: openId !== null,
    queryFn: async () => {
      const [{ data: tx }, { data: items }] = await Promise.all([
        supabase
          .from("transactions")
          .select("*, locations(name)")
          .eq("id", openId!)
          .single(),
        supabase
          .from("transaction_items")
          .select("quantity, price_at_transaction, subtotal, products(name, sku)")
          .eq("transaction_id", openId!),
      ]);
      return { tx, items: items ?? [] };
    },
  });

  return (
    <div>
      <PageHeader
        title="Riwayat Transaksi"
        subtitle={`${filtered.length} transaksi`}
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Cari kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        }
      />

      <div className="p-6">
        <div className="nb-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground text-background">
              <tr className="text-xs font-bold uppercase tracking-wider">
                <th className="text-left px-4 py-3">Kode</th>
                <th className="text-left px-4 py-3">Tanggal</th>
                <th className="text-left px-4 py-3">Lokasi</th>
                <th className="text-left px-4 py-3">Metode</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-6 text-center font-bold uppercase text-sm">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center">
                  <Receipt className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="font-bold uppercase text-sm">Belum ada transaksi.</p>
                </td></tr>
              ) : (
                filtered.map((t: any) => (
                  <tr key={t.id} className="border-t-2 border-foreground hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-bold">{t.transaction_code}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {format(new Date(t.created_at), "d MMM yyyy, HH:mm")}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{t.locations?.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-secondary border-2 border-foreground text-xs font-bold uppercase">
                        {t.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold">{formatRupiah(t.final_price)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setOpenId(t.id)}>
                        <Eye className="h-3 w-3" /> Lihat
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display uppercase">Detail Transaksi</DialogTitle>
          </DialogHeader>
          {detail?.tx && (
            <div className="font-mono text-sm space-y-3">
              <div className="text-center border-b-2 border-dashed border-foreground pb-3">
                <div className="font-display uppercase text-base">Toko POS</div>
                <div className="text-xs">{detail.tx.locations?.name}</div>
                <div className="text-xs mt-1">{detail.tx.transaction_code}</div>
                <div className="text-xs">{format(new Date(detail.tx.created_at), "d MMM yyyy HH:mm")}</div>
              </div>
              <div className="space-y-1 border-b-2 border-dashed border-foreground pb-3">
                {detail.items.map((it: any, i) => (
                  <div key={i}>
                    <div className="font-bold">{it.products?.name}</div>
                    <div className="flex justify-between">
                      <span>{it.quantity} x {formatRupiah(it.price_at_transaction)}</span>
                      <span>{formatRupiah(it.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(detail.tx.total_price)}</span></div>
                {Number(detail.tx.discount_amount) > 0 && (
                  <div className="flex justify-between"><span>Diskon</span><span>-{formatRupiah(detail.tx.discount_amount)}</span></div>
                )}
                {Number(detail.tx.tax_amount) > 0 && (
                  <div className="flex justify-between"><span>Pajak</span><span>{formatRupiah(detail.tx.tax_amount)}</span></div>
                )}
                <div className="flex justify-between font-display text-base border-t-2 border-dashed border-foreground pt-2">
                  <span>Total</span><span>{formatRupiah(detail.tx.final_price)}</span>
                </div>
                <div className="flex justify-between"><span>Bayar ({detail.tx.payment_method})</span><span>{formatRupiah(detail.tx.cash_received ?? detail.tx.final_price)}</span></div>
                {Number(detail.tx.cash_change) > 0 && (
                  <div className="flex justify-between"><span>Kembali</span><span>{formatRupiah(detail.tx.cash_change)}</span></div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
