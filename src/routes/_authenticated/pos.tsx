import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Minus, Trash2, Package, ShoppingCart, Receipt } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { formatRupiah, genTrxCode } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/pos")({ component: PosPage });

type CartItem = { id: number; name: string; price: number; qty: number; stock: number };

function PosPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [locId, setLocId] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payOpen, setPayOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cashReceived, setCashReceived] = useState("");
  const [receipt, setReceipt] = useState<any>(null);

  const { data: locations } = useQuery({
    queryKey: ["locations-selling"],
    queryFn: async () => (await supabase.from("locations").select("*").eq("is_selling_point", true).order("name")).data ?? [],
  });

  useEffect(() => {
    if (!locId && (locations ?? []).length) setLocId(String(locations![0].id));
  }, [locations, locId]);

  const { data: products } = useQuery({
    queryKey: ["pos-products", locId, search],
    enabled: !!locId,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, sku, name, selling_price, unit, product_stocks(quantity, location_id)")
        .eq("is_active", true).order("name").limit(60);
      let list = data ?? [];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
      }
      return list.map((p: any) => {
        const stockRow = (p.product_stocks ?? []).find((s: any) => String(s.location_id) === locId);
        return { ...p, stock: stockRow?.quantity ?? 0 };
      });
    },
  });

  const total = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);
  const change = useMemo(() => Math.max(0, Number(cashReceived || 0) - total), [cashReceived, total]);

  const addToCart = (p: any) => {
    if (p.stock <= 0) { toast.error("Stok habis"); return; }
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      if (ex) {
        if (ex.qty + 1 > p.stock) { toast.error("Melebihi stok"); return c; }
        return c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...c, { id: p.id, name: p.name, price: Number(p.selling_price), qty: 1, stock: p.stock }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((c) => c.map((x) => {
      if (x.id !== id) return x;
      const next = x.qty + delta;
      if (next > x.stock) { toast.error("Stok tidak cukup"); return x; }
      return { ...x, qty: next };
    }).filter((x) => x.qty > 0));
  };

  const checkout = useMutation({
    mutationFn: async () => {
      if (!user || !locId) throw new Error("Pilih lokasi");
      if (cart.length === 0) throw new Error("Keranjang kosong");
      if (paymentMethod === "Cash" && Number(cashReceived) < total) throw new Error("Uang kurang");
      const code = genTrxCode();
      const { data: tx, error } = await supabase.from("transactions").insert({
        transaction_code: code, cashier_id: user.id, location_id: Number(locId),
        total_price: total, final_price: total, payment_method: paymentMethod,
        cash_received: paymentMethod === "Cash" ? Number(cashReceived) : null,
        cash_change: paymentMethod === "Cash" ? change : null,
      }).select().single();
      if (error) throw error;
      const items = cart.map((c) => ({
        transaction_id: tx.id, product_id: c.id, quantity: c.qty,
        price_at_transaction: c.price, subtotal: c.price * c.qty,
      }));
      const { error: e2 } = await supabase.from("transaction_items").insert(items);
      if (e2) throw e2;
      return { tx, items: cart };
    },
    onSuccess: (r) => {
      setReceipt(r); setCart([]); setCashReceived(""); setPayOpen(false);
      qc.invalidateQueries({ queryKey: ["pos-products"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Transaksi berhasil");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-card px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3"><ShoppingCart className="text-primary" /><h1 className="text-lg font-bold">Kasir</h1></div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Lokasi:</Label>
          <Select value={locId} onValueChange={setLocId}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Pilih toko" /></SelectTrigger>
            <SelectContent>
              {(locations ?? []).map((l) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 min-h-0">
        <div className="lg:col-span-2 border-r bg-card flex flex-col min-h-0">
          <div className="px-5 py-4 border-b"><h2 className="font-semibold">Keranjang ({cart.length})</h2></div>
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 text-sm">Pilih produk untuk mulai</div>
            ) : cart.map((it) => (
              <div key={it.id} className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{formatRupiah(it.price)}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(it.id, -1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-8 text-center font-semibold">{it.qty}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(it.id, 1)}><Plus className="h-3 w-3" /></Button>
                </div>
                <div className="w-24 text-right font-semibold text-sm">{formatRupiah(it.price * it.qty)}</div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setCart((c) => c.filter((x) => x.id !== it.id))}><Trash2 className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
          <div className="border-t p-5 bg-secondary/30 space-y-3">
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Total Item</span><span>{cart.reduce((s, c) => s + c.qty, 0)}</span></div>
            <div className="flex items-center justify-between"><span className="font-semibold">TOTAL</span><span className="text-2xl font-bold text-primary">{formatRupiah(total)}</span></div>
            <Button className="w-full h-12 text-base bg-success hover:bg-success/90 text-success-foreground" disabled={cart.length === 0} onClick={() => setPayOpen(true)}>PROSES PEMBAYARAN</Button>
          </div>
        </div>
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input autoFocus placeholder="Scan barcode / cari nama produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-11" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(products ?? []).map((p: any) => (
                <button key={p.id} onClick={() => addToCart(p)} disabled={p.stock <= 0}
                  className="text-left p-3 rounded-lg border bg-card hover:border-primary hover:shadow-[var(--shadow-soft)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="aspect-square rounded-md bg-secondary flex items-center justify-center mb-2"><Package className="h-8 w-8 text-muted-foreground" /></div>
                  <div className="text-xs text-muted-foreground truncate">{p.sku}</div>
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary font-bold text-sm">{formatRupiah(p.selling_price)}</span>
                    <span className={`text-xs ${p.stock <= 0 ? "text-destructive" : "text-muted-foreground"}`}>Stok: {p.stock}</span>
                  </div>
                </button>
              ))}
              {(products ?? []).length === 0 && <div className="col-span-full text-center text-muted-foreground py-12">Tidak ada produk.</div>}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Pembayaran</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Total Tagihan</div>
              <div className="text-3xl font-bold text-primary">{formatRupiah(total)}</div>
            </div>
            <div className="space-y-1.5"><Label>Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Tunai</SelectItem>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === "Cash" && (<>
              <div className="space-y-1.5"><Label>Uang Diterima</Label>
                <Input type="number" min={0} value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} className="text-lg h-12" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[total, 50000, 100000, 200000].map((v) => (
                  <Button key={v} variant="outline" size="sm" onClick={() => setCashReceived(String(v))}>{formatRupiah(v)}</Button>
                ))}
              </div>
              <div className="flex justify-between bg-success/10 rounded-lg p-3"><span className="font-medium">Kembalian</span><span className="font-bold text-success">{formatRupiah(change)}</span></div>
            </>)}
            <Button className="w-full h-12 bg-success hover:bg-success/90 text-success-foreground"
              disabled={checkout.isPending || (paymentMethod === "Cash" && Number(cashReceived) < total)}
              onClick={() => checkout.mutate()}>Selesaikan Transaksi</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Struk Transaksi</DialogTitle></DialogHeader>
          {receipt && (
            <div className="font-mono text-xs space-y-2">
              <div className="text-center">
                <div className="font-bold text-base">TOKO POS</div>
                <div className="text-muted-foreground">{receipt.tx.transaction_code}</div>
                <div className="text-muted-foreground">{new Date(receipt.tx.created_at).toLocaleString("id-ID")}</div>
              </div>
              <div className="border-t border-dashed pt-2 space-y-1">
                {receipt.items.map((it: CartItem) => (
                  <div key={it.id}>
                    <div>{it.name}</div>
                    <div className="flex justify-between"><span>{it.qty} x {formatRupiah(it.price)}</span><span>{formatRupiah(it.qty * it.price)}</span></div>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed pt-2 space-y-1">
                <div className="flex justify-between font-bold"><span>TOTAL</span><span>{formatRupiah(receipt.tx.final_price)}</span></div>
                <div className="flex justify-between"><span>{receipt.tx.payment_method}</span><span>{formatRupiah(receipt.tx.cash_received ?? receipt.tx.final_price)}</span></div>
                {receipt.tx.cash_change != null && <div className="flex justify-between"><span>Kembali</span><span>{formatRupiah(receipt.tx.cash_change)}</span></div>}
              </div>
              <div className="text-center pt-2">Terima kasih!</div>
            </div>
          )}
          <Button onClick={() => setReceipt(null)} className="w-full">Tutup</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
