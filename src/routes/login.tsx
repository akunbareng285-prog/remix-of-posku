import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — POS Multi-Lokasi" },
      {
        name: "description",
        content: "Masuk ke aplikasi kasir multi-lokasi Anda.",
      },
      { property: "og:title", content: "Masuk — POS Multi-Lokasi" },
      {
        property: "og:description",
        content: "Masuk ke aplikasi kasir multi-lokasi Anda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Isi email dan password terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.navigate({ to: "/dashboard" });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.navigate({ to: "/dashboard" });
        } else {
          toast.success(
            "Pendaftaran berhasil. Periksa email Anda untuk verifikasi sebelum masuk.",
          );
          setMode("signin");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2.5 font-display text-xl"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-foreground bg-primary shadow-brutal-sm">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          POS Multi-Lokasi
        </Link>

        <div className="rounded-2xl border-[3px] border-foreground bg-card p-7 shadow-brutal-lg">
          <h1 className="font-display text-2xl">
            {mode === "signin" ? "Masuk ke Aplikasi" : "Daftar Akun Baru"}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            {mode === "signin"
              ? "Gunakan email dan password kasir, admin, atau pemilik."
              : "Akun pertama yang mendaftar otomatis menjadi admin."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-bold">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@toko.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-bold">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {mode === "signin" ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-sm font-bold text-primary underline-offset-4 hover:underline"
          >
            {mode === "signin"
              ? "Belum punya akun? Daftar di sini"
              : "Sudah punya akun? Masuk di sini"}
          </button>
        </div>
      </div>
    </div>
  );
}
