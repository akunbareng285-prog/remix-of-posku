import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  Package,
  Warehouse,
  BarChart3,
  Users,
  Zap,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Toko POS — Sistem Kasir Multi-Lokasi" },
      {
        name: "description",
        content:
          "Aplikasi kasir & manajemen stok multi-lokasi yang cepat, sederhana, dan tegas. Kelola produk, transaksi, dan tim dari satu tempat.",
      },
      { property: "og:title", content: "Toko POS — Sistem Kasir Multi-Lokasi" },
      {
        property: "og:description",
        content: "Kasir, stok, multi-lokasi, dan laporan dalam satu aplikasi.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="border-b-2 border-foreground bg-background sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent border-2 border-foreground flex items-center justify-center font-display text-lg nb-shadow-sm">
              T
            </div>
            <span className="font-display uppercase text-xl">Toko POS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wide">
            <a href="#fitur" className="hover:underline underline-offset-4">Fitur</a>
            <a href="#harga" className="hover:underline underline-offset-4">Harga</a>
            <a href="#testi" className="hover:underline underline-offset-4">Testimoni</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Masuk</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/login">Coba Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent border-2 border-foreground nb-shadow-sm mb-6 text-xs font-bold uppercase">
              <Zap className="h-3 w-3" /> Versi 1.0 — Siap Pakai
            </div>
            <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.95]">
              Kasir <span className="bg-primary text-primary-foreground px-2 inline-block border-2 border-foreground nb-shadow">Tegas.</span>
              <br /> Stok <span className="bg-accent px-2 inline-block border-2 border-foreground nb-shadow">Rapi.</span>
              <br /> Tim <span className="bg-success text-success-foreground px-2 inline-block border-2 border-foreground nb-shadow">Solid.</span>
            </h1>
            <p className="mt-6 text-lg font-medium max-w-xl">
              Sistem kasir & manajemen stok multi-lokasi untuk warung, toko, dan
              UKM yang ingin tumbuh tanpa ribet. Tanpa instalasi, tanpa biaya
              tersembunyi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  Mulai Sekarang <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#fitur">Lihat Fitur</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm font-bold">
              <div className="flex -space-x-2">
                {["#9B0F06", "#FFD700", "#22C55E", "#0EA5E9"].map((c) => (
                  <div
                    key={c}
                    className="h-8 w-8 rounded-full border-2 border-foreground"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-foreground" />
                  ))}
                </div>
                <div className="text-xs">500+ pemilik toko sudah pakai</div>
              </div>
            </div>
          </div>

          {/* Mock POS Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary border-2 border-foreground rounded-md translate-x-3 translate-y-3" />
            <div className="relative nb-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-display uppercase">Struk Hari Ini</div>
                <span className="px-2 py-1 bg-success text-success-foreground border-2 border-foreground text-xs font-bold uppercase">
                  Live
                </span>
              </div>
              <div className="space-y-2 font-mono text-sm border-y-2 border-dashed border-foreground py-3">
                {[
                  ["Kopi Susu", "2x", "30.000"],
                  ["Roti Bakar", "1x", "15.000"],
                  ["Mie Goreng", "3x", "45.000"],
                ].map(([n, q, p]) => (
                  <div key={n} className="flex justify-between">
                    <span>{n} {q}</span>
                    <span>Rp {p}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-display uppercase text-sm">Total</span>
                <span className="font-display text-2xl">Rp 90.000</span>
              </div>
              <Button className="w-full mt-4" size="lg">
                Bayar Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="border-b-2 border-foreground bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display uppercase text-4xl md:text-5xl">Semua yang kamu butuhkan</h2>
            <p className="mt-4 text-lg font-medium">Dari kasir sampai laporan, dari satu lokasi sampai sepuluh.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ShoppingCart, title: "Kasir Cepat", desc: "Input transaksi dalam hitungan detik. Cetak struk langsung.", bg: "bg-primary text-primary-foreground" },
              { icon: Package, title: "Manajemen Produk", desc: "SKU, harga, kategori, stok minimum — semua tertata.", bg: "bg-accent" },
              { icon: Warehouse, title: "Stok Multi-Lokasi", desc: "Lacak stok per gudang & toko. Transfer antar lokasi.", bg: "bg-success text-success-foreground" },
              { icon: BarChart3, title: "Laporan Real-time", desc: "Penjualan harian, produk terlaris, tren — di satu dashboard.", bg: "bg-card" },
              { icon: Users, title: "Multi-User & Role", desc: "Kasir, manajer gudang, owner — masing-masing punya akses.", bg: "bg-card" },
              { icon: Zap, title: "Tanpa Instalasi", desc: "Buka di browser. Bekerja di laptop, tablet, atau HP.", bg: "bg-card" },
            ].map(({ icon: Icon, title, desc, bg }) => (
              <div key={title} className={`nb-card p-6 nb-press ${bg}`}>
                <div className="h-12 w-12 rounded-md border-2 border-foreground bg-background flex items-center justify-center mb-4 nb-shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display uppercase text-xl mb-2">{title}</h3>
                <p className="text-sm font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="harga" className="border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display uppercase text-4xl md:text-5xl">Harga Jujur</h2>
            <p className="mt-4 text-lg font-medium">Tidak ada biaya per transaksi. Tidak ada kejutan.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "Gratis", per: "selamanya", features: ["1 lokasi", "1 user", "Produk tak terbatas", "Laporan dasar"], cta: "Mulai Gratis", highlight: false },
              { name: "Pro", price: "Rp 149rb", per: "/ bulan", features: ["Hingga 3 lokasi", "10 user", "Multi-role", "Laporan lengkap", "Cetak struk"], cta: "Coba 14 Hari", highlight: true },
              { name: "Bisnis", price: "Rp 399rb", per: "/ bulan", features: ["Lokasi tak terbatas", "User tak terbatas", "API & integrasi", "Prioritas support"], cta: "Hubungi Kami", highlight: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`nb-card p-6 ${p.highlight ? "bg-accent -rotate-1 nb-shadow-lg" : ""}`}
              >
                {p.highlight && (
                  <div className="inline-block px-3 py-1 bg-primary text-primary-foreground border-2 border-foreground text-xs font-bold uppercase mb-3 nb-shadow-sm">
                    Paling Populer
                  </div>
                )}
                <div className="font-display uppercase text-2xl">{p.name}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl">{p.price}</span>
                  <span className="text-sm font-medium opacity-70">{p.per}</span>
                </div>
                <ul className="mt-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium">
                      <Check className="h-4 w-4 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full mt-6" variant={p.highlight ? "default" : "outline"}>
                  <Link to="/login">{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testi" className="border-b-2 border-foreground bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display uppercase text-4xl md:text-5xl text-center mb-12">Kata Mereka</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Budi S.", role: "Pemilik Warung Kopi", quote: "Pencatatan stok jadi gampang. Saya nggak pernah lagi kehabisan biji kopi tanpa sadar." },
              { name: "Sari W.", role: "Toko Kelontong", quote: "Kasir baru saya cuma butuh 5 menit buat ngerti pakai. Antarmukanya jelas." },
              { name: "Andi P.", role: "Manajer Mini Market", quote: "Multi-lokasi-nya ngebantu banget. Saya bisa monitor 4 cabang dari rumah." },
            ].map((t) => (
              <div key={t.name} className="nb-card p-6 bg-background text-foreground">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-foreground" />
                  ))}
                </div>
                <p className="font-medium mb-4">"{t.quote}"</p>
                <div className="font-display uppercase text-sm">{t.name}</div>
                <div className="text-xs opacity-70 font-bold uppercase">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-foreground bg-accent">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display uppercase text-4xl md:text-6xl">Siap jualan lebih cepat?</h2>
          <p className="mt-4 text-lg font-medium max-w-xl mx-auto">
            Buat akun gratis sekarang. Tidak perlu kartu kredit.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/login">
              Mulai Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent text-accent-foreground border-2 border-background flex items-center justify-center font-display text-lg">
              T
            </div>
            <span className="font-display uppercase text-lg">Toko POS</span>
          </div>
          <div className="text-xs font-bold uppercase opacity-70">
            © {new Date().getFullYear()} Toko POS. Dibuat dengan tegas.
          </div>
        </div>
      </footer>
    </div>
  );
}
