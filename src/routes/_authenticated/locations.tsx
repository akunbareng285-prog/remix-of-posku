import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/PageHeader";
import { Trash2, Plus, Store, Warehouse } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/locations")({
  component: LocationsPage,
});

function LocationsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [isShop, setIsShop] = useState(false);

  const { data } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => (await supabase.from("locations").select("*").order("name")).data ?? [],
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("locations").insert({ name, is_selling_point: isShop });
      if (error) throw error;
    },
    onSuccess: () => {
      setName(""); setIsShop(false);
      toast.success("Lokasi ditambahkan");
      qc.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Lokasi" subtitle="Gudang dan toko" />
      <div className="p-6 max-w-2xl space-y-6">
        <Card className="p-5 space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) add.mutate(); }} className="space-y-3">
            <Input placeholder='Nama lokasi (contoh: "Gudang Utama")' value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex items-center justify-between">
              <Label htmlFor="shop" className="cursor-pointer">Lokasi penjualan (kasir)</Label>
              <Switch id="shop" checked={isShop} onCheckedChange={setIsShop} />
            </div>
            <Button type="submit" disabled={add.isPending} className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Tambah Lokasi
            </Button>
          </form>
        </Card>
        <div className="space-y-2">
          {(data ?? []).map((l) => (
            <Card key={l.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${l.is_selling_point ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
                  {l.is_selling_point ? <Store className="h-5 w-5" /> : <Warehouse className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.is_selling_point ? "Toko / titik penjualan" : "Gudang"}</div>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => del.mutate(l.id)} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
