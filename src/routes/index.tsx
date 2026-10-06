import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, MapPin, ReceiptText, Store } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "POS Multi-Lokasi — Kasir & Stok dalam Satu Aplikasi",
      },
      {
        name: "description",
        content:
          "Aplikasi kasir multi-lokasi: transaksi cepat, stok gudang & toko terpusat, laporan penjualan harian.",
      },
      {
        property: "og:title",
        content: "POS Multi-Lokasi — Kasir & Stok dalam Satu Aplikasi",
      },
      {
        property: "og:description",
        content:
          "Aplikasi kasir multi-lokasi: transaksi cepat, stok gudang & toko terpusat, laporan penjualan harian.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: ReceiptText,
    title: "Kasir Cepat",
    desc: "Transaksi harian dengan keranjang, kembalian otomatis, dan struk siap cetak.",
  },
  {
    icon: Boxes,
    title: "Stok Terpusat",
    desc: "Barang masuk, transfer antar lokasi, dan mutasi stok tercatat otomatis.",
  },
  {
    icon: MapPin,
    title: "Multi-Lokasi",
    desc: "Kelola gudang utama dan banyak toko cabang dari satu dashboard.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-foreground bg-primary shadow-brutal-sm">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg">POS Multi-Lokasi</span>
        </div>
        <Link
          to="/login"
          className="inline-flex h-10 items-center rounded-xl border-[3px] border-foreground bg-warning px-4 font-bold shadow-brutal-sm transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal"
        >
          Masuk
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20">
        <section className="py-14 md:py-20">
          <span className="inline-block rounded-lg border-[3px] border-foreground bg-muted px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Kasir &bull; Gudang &bull; Laporan
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight md:text-6xl md:leading-[1.1]">
            Kelola penjualan dan stok semua toko dari satu tempat.
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium text-muted-foreground">
            Transaksi lebih cepat, stok antar gudang dan cabang selalu akurat,
            dan laporan harian langsung tersedia tanpa rekap manual.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="inline-flex h-14 items-center gap-2 rounded-xl border-[3px] border-foreground bg-primary px-7 text-base font-bold text-primary-foreground shadow-brutal transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-lg"
            >
              Mulai Sekarang <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="text-sm font-semibold text-muted-foreground">
              Gratis untuk toko pertama Anda
            </span>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border-[3px] border-foreground bg-card p-6 shadow-brutal transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-foreground bg-warning shadow-brutal-sm">
                <f.icon className="h-6 w-6 text-warning-foreground" />
              </div>
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-2 font-medium text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t-[3px] border-foreground bg-muted py-6">
        <p className="text-center text-sm font-semibold text-muted-foreground">
          &copy; {new Date().getFullYear()} POS Multi-Lokasi
        </p>
      </footer>
    </div>
  );
}
