import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/hooks/use-auth";
import { Shield, X, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Role = "admin" | "cashier" | "warehouse_manager" | "owner";
const ALL_ROLES: Role[] = ["admin", "owner", "warehouse_manager", "cashier"];

const roleLabel: Record<Role, string> = {
  admin: "Admin",
  owner: "Pemilik",
  warehouse_manager: "Admin Gudang",
  cashier: "Kasir",
};

const roleColor: Record<Role, string> = {
  admin: "bg-primary text-primary-foreground",
  owner: "bg-accent text-accent-foreground",
  warehouse_manager: "bg-secondary text-secondary-foreground",
  cashier: "bg-muted text-foreground",
};

export const Route = createFileRoute("/_authenticated/users")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: UsersPage,
});

function UsersPage() {
  const qc = useQueryClient();
  const { user: me } = useAuth();
  const [addingFor, setAddingFor] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      const byUser = new Map<string, Role[]>();
      for (const r of rolesRes.data ?? []) {
        const arr = byUser.get(r.user_id) ?? [];
        arr.push(r.role as Role);
        byUser.set(r.user_id, arr);
      }
      return (profilesRes.data ?? []).map((p) => ({
        ...p,
        roles: byUser.get(p.id) ?? [],
      }));
    },
  });

  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role ditambahkan");
      setAddingFor(null);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role dihapus");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Manajemen Pengguna"
        subtitle="Kelola pengguna dan tetapkan peran"
      />
      <div className="p-6 max-w-4xl space-y-3">
        {isLoading && (
          <Card className="p-6 text-sm text-muted-foreground">Memuat...</Card>
        )}
        {(data ?? []).map((u) => {
          const available = ALL_ROLES.filter((r) => !u.roles.includes(r));
          const isMe = u.id === me?.id;
          return (
            <Card key={u.id} className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate flex items-center gap-2">
                      {u.full_name ?? "(Tanpa nama)"}
                      {isMe && (
                        <span className="text-xs text-muted-foreground">(Anda)</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {u.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {u.roles.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      Belum ada role
                    </span>
                  )}
                  {u.roles.map((r) => (
                    <Badge
                      key={r}
                      className={`${roleColor[r]} gap-1 pl-2 pr-1 py-1`}
                    >
                      <Shield className="h-3 w-3" />
                      {roleLabel[r]}
                      <button
                        onClick={() =>
                          removeRole.mutate({ userId: u.id, role: r })
                        }
                        disabled={isMe && r === "admin"}
                        className="ml-1 rounded-full hover:bg-black/10 p-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
                        title={
                          isMe && r === "admin"
                            ? "Tidak bisa menghapus admin diri sendiri"
                            : "Hapus role"
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  {available.length > 0 &&
                    (addingFor === u.id ? (
                      <Select
                        onValueChange={(v) => {
                          addRole.mutate({ userId: u.id, role: v as Role });
                        }}
                      >
                        <SelectTrigger className="h-8 w-44">
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          {available.map((r) => (
                            <SelectItem key={r} value={r}>
                              {roleLabel[r]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAddingFor(u.id)}
                      >
                        + Tambah role
                      </Button>
                    ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
