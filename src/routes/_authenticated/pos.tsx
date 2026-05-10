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
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b-2 border-foreground bg-accent px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="nb-border bg-primary text-primary-foreground p-2"><ShoppingCart className="h-5 w-5" /></div>
          <h1 className="text-2xl font-display uppercase tracking-tight">Kasir</h1>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Lokasi:</Label>
          <Select value={locId} onValueChange={setLocId}>
            <SelectTrigger className="w-52 font-bold"><SelectValue placeholder="Pilih toko" /></SelectTrigger>
            <SelectContent>
              {(locations ?? []).map((l) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 min-h-0">
        <aside className="lg:col-span-2 border-r-2 border-foreground bg-card flex flex-col min-h-0">
          <div className="px-5 py-4 border-b-2 border-foreground bg-secondary">
            <h2 className="font-display uppercase text-lg">Keranjang ({cart.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="nb-border bg-background inline-block p-6 mb-3"><ShoppingCart className="h-10 w-10 opacity-50" /></div>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground/60">Pilih produk untuk mulai</p>
              </div>
            ) : cart.map((it) => (
              <div key={it.id} className="flex items-center gap-2 p-3 nb-border bg-background">
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{it.name}</div>
                  <div className="text-xs font-mono">{formatRupiah(it.price)}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(it.id, -1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-8 text-center font-black">{it.qty}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(it.id, 1)}><Plus className="h-3 w-3" /></Button>
                </div>
                <div className="w-24 text-right font-black text-sm">{formatRupiah(it.price * it.qty)}</div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setCart((c) => c.filter((x) => x.id !== it.id))}><Trash2 className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-foreground p-5 bg-accent space-y-3">
            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider">
              <span>Total Item</span><span>{cart.reduce((s, c) => s + c.qty, 0)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t-2 border-foreground">
              <span className="font-display uppercase">TOTAL</span>
              <span className="text-3xl font-display">{formatRupiah(total)}</span>
            </div>
            <Button className="w-full h-14 text-base bg-primary text-primary-foreground hover:bg-primary uppercase font-display" disabled={cart.length === 0} onClick={() => setPayOpen(true)}>
              Proses Pembayaran
            </Button>
          </div>
        </aside>
        <main className="lg:col-span-3 flex flex-col min-h-0">
          <div className="p-4 border-b-2 border-foreground bg-card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input autoFocus placeholder="Scan barcode / cari nama produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-12 font-bold" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(products ?? []).map((p: any) => (
                <button key={p.id} onClick={() => addToCart(p)} disabled={p.stock <= 0}
                  className="text-left p-3 nb-border nb-shadow-sm nb-press bg-card rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0">
                  <div className="aspect-square nb-border bg-secondary flex items-center justify-center mb-2">
                    <Package className="h-10 w-10" />
                  </div>
                  <div className="text-xs font-mono uppercase truncate text-foreground/60">{p.sku}</div>
                  <div className="font-bold text-sm truncate">{p.name}</div>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-foreground/20">
                    <span className="text-primary font-display text-sm">{formatRupiah(p.selling_price)}</span>
                    <span className={`text-xs font-bold uppercase px-1.5 py-0.5 nb-border ${p.stock <= 0 ? "bg-destructive text-destructive-foreground" : p.stock < 5 ? "bg-warning" : "bg-success"}`}>
                      {p.stock}
                    </span>
                  </div>
                </button>
              ))}
              {(products ?? []).length === 0 && <div className="col-span-full text-center font-bold uppercase py-12 text-foreground/60">Tidak ada produk.</div>}
            </div>
          </div>
        </main>
      </div>
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display uppercase">Pembayaran</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-5 bg-primary text-primary-foreground nb-border">
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">Total Tagihan</div>
              <div className="text-4xl font-display mt-1">{formatRupiah(total)}</div>
            </div>
            <div className="space-y-1.5"><Label className="font-bold uppercase text-xs">Metode Pembayaran</Label>
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
              <div className="space-y-1.5"><Label className="font-bold uppercase text-xs">Uang Diterima</Label>
                <Input type="number" min={0} value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} className="text-lg h-12 font-bold" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[total, 50000, 100000, 200000].map((v) => (
                  <Button key={v} variant="outline" size="sm" onClick={() => setCashReceived(String(v))}>{formatRupiah(v)}</Button>
                ))}
              </div>
              <div className="flex justify-between bg-success nb-border p-3">
                <span className="font-bold uppercase text-xs">Kembalian</span>
                <span className="font-display">{formatRupiah(change)}</span>
              </div>
            </>)}
            <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary uppercase font-display"
              disabled={checkout.isPending || (paymentMethod === "Cash" && Number(cashReceived) < total)}
              onClick={() => checkout.mutate()}>Selesaikan Transaksi</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 font-display uppercase"><Receipt className="h-5 w-5" /> Struk Transaksi</DialogTitle></DialogHeader>
          {receipt && (
            <div className="font-mono text-xs space-y-2 nb-border bg-card p-4">
              <div className="text-center">
                <div className="font-display text-base uppercase">TOKO POS</div>
                <div className="text-foreground/70">{receipt.tx.transaction_code}</div>
                <div className="text-foreground/70">{new Date(receipt.tx.created_at).toLocaleString("id-ID")}</div>
              </div>
              <div className="border-t-2 border-dashed border-foreground pt-2 space-y-1">
                {receipt.items.map((it: CartItem) => (
                  <div key={it.id}>
                    <div className="font-bold">{it.name}</div>
                    <div className="flex justify-between"><span>{it.qty} x {formatRupiah(it.price)}</span><span>{formatRupiah(it.qty * it.price)}</span></div>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-dashed border-foreground pt-2 space-y-1">
                <div className="flex justify-between font-display"><span>TOTAL</span><span>{formatRupiah(receipt.tx.final_price)}</span></div>
                <div className="flex justify-between"><span>{receipt.tx.payment_method}</span><span>{formatRupiah(receipt.tx.cash_received ?? receipt.tx.final_price)}</span></div>
                {receipt.tx.cash_change != null && <div className="flex justify-between"><span>Kembali</span><span>{formatRupiah(receipt.tx.cash_change)}</span></div>}
              </div>
              <div className="text-center pt-2 font-bold uppercase">Terima kasih!</div>
            </div>
          )}
          <Button onClick={() => setReceipt(null)} className="w-full">Tutup</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
