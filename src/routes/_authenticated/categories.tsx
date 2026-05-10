import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("categories").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      toast.success("Kategori ditambahkan");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dihapus");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Kategori" subtitle="Kelola kategori produk" />
      <div className="p-6 max-w-2xl space-y-6">
        <Card className="p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) add.mutate();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Nama kategori baru"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-bold"
            />
            <Button type="submit" disabled={add.isPending}>
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </form>
        </Card>
        <div className="space-y-2">
          {(data ?? []).map((c) => (
            <div key={c.id} className="nb-border bg-card px-5 py-3 flex items-center justify-between nb-shadow-sm">
              <span className="font-bold uppercase tracking-wide">{c.name}</span>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => del.mutate(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(data ?? []).length === 0 && (
            <p className="px-5 py-6 text-sm font-bold uppercase tracking-wider text-foreground/60 text-center">Belum ada kategori.</p>
          )}
        </div>
      </div>
    </div>
  );
}