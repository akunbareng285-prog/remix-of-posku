import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk — Toko POS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/dashboard" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Akun dibuat. Silakan masuk.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.error) {
      toast.error("Gagal masuk dengan Google");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--gradient-warm)]">
      <Card className="w-full max-w-md p-8 shadow-[var(--shadow-elegant)]">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center mb-3">
            <ShoppingBag className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Toko POS</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin" ? "Masuk untuk mulai bertransaksi" : "Buat akun baru"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nama lengkap</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {mode === "signin" ? "Masuk" : "Daftar"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> ATAU <div className="flex-1 h-px bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={google} disabled={busy}>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 11v3.6h5.07c-.22 1.4-1.59 4.1-5.07 4.1-3.05 0-5.54-2.52-5.54-5.7s2.49-5.7 5.54-5.7c1.74 0 2.9.74 3.57 1.38l2.43-2.34C16.46 4.86 14.42 4 12 4 6.98 4 3 7.98 3 13s3.98 9 9 9c5.2 0 8.65-3.66 8.65-8.81 0-.59-.06-1.04-.14-1.49H12z"/></svg>
          Masuk dengan Google
        </Button>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          {mode === "signin" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button type="button" className="text-primary font-medium hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </Card>
    </div>
  );
}