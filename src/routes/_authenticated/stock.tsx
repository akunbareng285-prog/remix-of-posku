import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/PageHeader";
import { PackagePlus, ArrowRightLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/stock")({
  component: StockPage,
});

function StockPage() {
  const qc = useQueryClient();
  const [locFilter, setLocFilter] = useState<string>("all");

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => (await supabase.from("locations").select("*").order("name")).data ?? [],
  });
  const { data: products } = useQuery({
    queryKey: ["products-min"],
    queryFn: async () =>
      (await supabase.from("products").select("id, name, sku, unit, min_stock_level").order("name")).data ?? [],
  });
  const { data: stocks } = useQuery({
    queryKey: ["stocks", locFilter],
    queryFn: async () => {
      let q = supabase
        .from("product_stocks")
        .select("id, quantity, products(id,name,sku,unit,min_stock_level), locations(id,name,is_selling_point)");
      if (locFilter !== "all") q = q.eq("location_id", Number(locFilter));
      const { data } = await q;
      return data ?? [];
    },
  });

  return (
    <div>
      <PageHeader
        title="Stok"
        subtitle="Stok produk per lokasi"
        actions={
          <div className="flex gap-2">
            <StockInDialog locations={locations ?? []} products={products ?? []} onDone={() => qc.invalidateQueries()} />
            <TransferDialog locations={locations ?? []} products={products ?? []} onDone={() => qc.invalidateQueries()} />
          </div>
        }
      />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Label className="text-sm">Lokasi:</Label>
          <Select value={locFilter} onValueChange={setLocFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua lokasi</SelectItem>
              {(locations ?? []).map((l) => (
                <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-foreground text-background text-left">
              <tr className="font-display uppercase tracking-wider">
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground">
              {(stocks ?? []).map((s: any) => {
                const low = s.quantity <= (s.products?.min_stock_level ?? 5);
                return (
                  <tr key={s.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-bold">{s.products?.name}</td>
                    <td className="px-4 py-3 font-mono text-xs uppercase">{s.products?.sku}</td>
                    <td className="px-4 py-3">{s.locations?.name}</td>
                    <td className="px-4 py-3 text-right font-display text-base">{s.quantity} <span className="text-xs opacity-60">{s.products?.unit}</span></td>
                    <td className="px-4 py-3 text-right">
                      {low ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 nb-border bg-warning font-black uppercase">
                          <AlertTriangle className="h-3 w-3" /> Tipis
                        </span>
                      ) : (
                        <span className="inline-flex text-xs px-2 py-1 nb-border bg-success font-black uppercase">Aman</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(stocks ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center font-bold uppercase tracking-wider text-foreground/60">Belum ada data stok.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function StockInDialog({ locations, products, onDone }: any) {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [locId, setLocId] = useState("");
  const [qty, setQty] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      const pid = Number(productId), lid = Number(locId), q = Number(qty);
      // upsert stock
      const { data: existing } = await supabase
        .from("product_stocks")
        .select("id, quantity")
        .eq("product_id", pid).eq("location_id", lid).maybeSingle();
      if (existing) {
        await supabase.from("product_stocks").update({ quantity: existing.quantity + q }).eq("id", existing.id);
      } else {
        await supabase.from("product_stocks").insert({ product_id: pid, location_id: lid, quantity: q });
      }
      await supabase.from("stock_movements").insert({
        product_id: pid, to_location_id: lid, quantity: q, type: "stock_in",
      });
    },
    onSuccess: () => {
      toast.success("Barang masuk dicatat");
      setOpen(false); setProductId(""); setLocId(""); setQty("");
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><PackagePlus className="h-4 w-4 mr-1" /> Barang Masuk</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Barang Masuk</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); submit.mutate(); }}>
          <div className="space-y-1.5">
            <Label>Produk</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
              <SelectContent>
                {products.map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Lokasi tujuan</Label>
            <Select value={locId} onValueChange={setLocId}>
              <SelectTrigger><SelectValue placeholder="Pilih lokasi" /></SelectTrigger>
              <SelectContent>
                {locations.map((l: any) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Jumlah</Label>
            <Input type="number" min={1} required value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={submit.isPending}>Simpan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TransferDialog({ locations, products, onDone }: any) {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [qty, setQty] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      const pid = Number(productId), f = Number(from), t = Number(to), q = Number(qty);
      if (f === t) throw new Error("Lokasi asal dan tujuan harus berbeda");
      const { data: src } = await supabase.from("product_stocks").select("id, quantity")
        .eq("product_id", pid).eq("location_id", f).maybeSingle();
      if (!src || src.quantity < q) throw new Error("Stok di lokasi asal tidak cukup");
      await supabase.from("product_stocks").update({ quantity: src.quantity - q }).eq("id", src.id);
      const { data: dst } = await supabase.from("product_stocks").select("id, quantity")
        .eq("product_id", pid).eq("location_id", t).maybeSingle();
      if (dst) {
        await supabase.from("product_stocks").update({ quantity: dst.quantity + q }).eq("id", dst.id);
      } else {
        await supabase.from("product_stocks").insert({ product_id: pid, location_id: t, quantity: q });
      }
      await supabase.from("stock_movements").insert({
        product_id: pid, from_location_id: f, to_location_id: t, quantity: q, type: "transfer",
      });
    },
    onSuccess: () => {
      toast.success("Transfer berhasil");
      setOpen(false); setProductId(""); setFrom(""); setTo(""); setQty("");
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><ArrowRightLeft className="h-4 w-4 mr-1" /> Transfer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Transfer Stok</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); submit.mutate(); }}>
          <div className="space-y-1.5">
            <Label>Produk</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
              <SelectContent>
                {products.map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Dari</Label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger><SelectValue placeholder="Asal" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l: any) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Ke</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger><SelectValue placeholder="Tujuan" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l: any) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Jumlah</Label>
            <Input type="number" min={1} required value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={submit.isPending}>Transfer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}