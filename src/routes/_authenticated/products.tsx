import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/PageHeader";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/products")({ component: ProductsPage });

const empty = { sku: "", name: "", unit: "pcs", category_id: "", purchase_price: "0", selling_price: "0", min_stock_level: "5" };

function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(empty);

  const { data: cats } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("name")).data ?? [],
  });
  const { data: products } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      let q = supabase.from("products").select("*, categories(name)").order("name");
      if (search) q = q.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
      const { data } = await q;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        sku: form.sku, name: form.name, unit: form.unit,
        category_id: form.category_id ? Number(form.category_id) : null,
        purchase_price: Number(form.purchase_price) || 0,
        selling_price: Number(form.selling_price) || 0,
        min_stock_level: Number(form.min_stock_level) || 5,
      };
      if (form.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Produk disimpan"); setOpen(false); setForm(empty); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: number) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Dihapus"); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (p: any) => {
    setForm({ id: p.id, sku: p.sku, name: p.name, unit: p.unit, category_id: p.category_id ? String(p.category_id) : "",
      purchase_price: String(p.purchase_price), selling_price: String(p.selling_price), min_stock_level: String(p.min_stock_level) });
    setOpen(true);
  };

  return (
    <div>
      <PageHeader title="Produk" subtitle="Master daftar produk" actions={
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(empty); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Produk Baru</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{form.id ? "Edit Produk" : "Produk Baru"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>SKU</Label><Input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Satuan</Label><Input required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label>Nama</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Kategori</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>{(cats ?? []).map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label>Harga Beli</Label><Input type="number" min={0} value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Harga Jual</Label><Input type="number" min={0} required value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Min Stok</Label><Input type="number" min={0} value={form.min_stock_level} onChange={(e) => setForm({ ...form, min_stock_level: e.target.value })} /></div>
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full">Simpan</Button>
            </form>
          </DialogContent>
        </Dialog>
      } />
      <div className="p-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama atau SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(products ?? []).map((p: any) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{p.sku}</div>
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.categories?.name ?? "-"} • per {p.unit}</div>
                  <div className="text-primary font-bold mt-1">{formatRupiah(p.selling_price)}</div>
                </div>
              </div>
              <div className="flex justify-end gap-1 mt-3">
                <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => del.mutate(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
          {(products ?? []).length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Belum ada produk.</p>}
        </div>
      </div>
    </div>
  );
}
