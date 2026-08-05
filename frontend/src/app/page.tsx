'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  ArrowRightLeft,
  FileBarChart,
  ShieldCheck,
  Check,
  ChevronDown,
  ArrowRight,
  Building2,
  Boxes,
  Tag,
  TrendingUp,
  Receipt,
  Layers,
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'pos' | 'dashboard' | 'stok'>('pos');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const featureCards = [
    {
      icon: ShoppingCart,
      title: 'Kasir POS Cepat & Responsif',
      desc: 'Antarmuka transaksi yang presisi, pencarian produk instan, kalkulasi otomatis, dan cetak struk via printer thermal Bluetooth atau USB.',
      color: 'orange',
      badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      hoverBorder: 'hover:border-orange-500/40 hover:shadow-orange-500/5',
    },
    {
      icon: Building2,
      title: 'Manajemen Multi-Lokasi',
      desc: 'Kelola banyak toko dan gudang dalam satu akun terpusat. Pantau performa masing-masing lokasi secara terpisah maupun gabungan.',
      color: 'indigo',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      hoverBorder: 'hover:border-indigo-500/40 hover:shadow-indigo-500/5',
    },
    {
      icon: ArrowRightLeft,
      title: 'Transfer & Mutasi Stok',
      desc: 'Kirim barang antar cabang dengan alur pengajuan, persetujuan, dan pembaruan jumlah stok secara otomatis di setiap gudang.',
      color: 'cyan',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      hoverBorder: 'hover:border-cyan-500/40 hover:shadow-cyan-500/5',
    },
    {
      icon: FileBarChart,
      title: 'Laporan Keuangan & Analytics',
      desc: 'Ringkasan omset harian, produk terlaris, margin keuntungan, serta riwayat transaksi kasir secara transparan dan terstruktur.',
      color: 'emerald',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40 hover:shadow-emerald-500/5',
    },
    {
      icon: ShieldCheck,
      title: 'Kontrol Peran & Wewenang',
      desc: 'Bagi hak akses pengguna sesuai struktur organisasi: Super Admin, Manager Toko, dan Kasir dengan batas akses teratur.',
      color: 'rose',
      badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      hoverBorder: 'hover:border-rose-500/40 hover:shadow-rose-500/5',
    },
    {
      icon: Tag,
      title: 'Manajemen Promosi & Diskon',
      desc: 'Atur program potongan harga, skema grosir, atau diskon khusus untuk cabang toko tertentu berdasarkan periode waktu.',
      color: 'amber',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      hoverBorder: 'hover:border-amber-500/40 hover:shadow-amber-500/5',
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* ============================================================
         1. NAVBAR
         ============================================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <img src="/logo_color.png" alt="POS Logo" className="h-6 w-auto object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                POS<span className="text-orange-500">.SYSTEM</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider -mt-1">Multi-Location</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#fitur" className="hover:text-orange-500 transition-colors">Fitur Utama</a>
            <a href="#demo" className="hover:text-orange-500 transition-colors">Antarmuka</a>
            <a href="#harga" className="hover:text-orange-500 transition-colors">Harga</a>
            <a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 flex items-center gap-2 active:scale-95 group"
            >
              <span>Coba Demo</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================
         2. HERO SECTION
         ============================================================ */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 border-b border-slate-800/80">
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-8">
            Kelola Banyak Cabang Toko <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Dalam Satu Aplikasi Terpadu
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-normal">
            Platform Point of Sale terpusat untuk memantau transaksi kasir real-time, mengontrol inventori stok antar cabang, dan menganalisis laporan keuangan tanpa hambatan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/login"
              className="w-full sm:w-auto text-base font-bold bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 active:translate-y-0 group"
            >
              <span>Mulai Demo Gratis</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto text-base font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Lihat Antarmuka POS</span>
            </a>
          </div>

          {/* Hero Visual Showcase Mockup */}
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 hover:border-slate-700/80 transition-all duration-300">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-500 ml-2">pos-system.com / dashboard</span>
              </div>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multi-Outlet Overview</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              
              {/* Card 1: Emerald Accent */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-200 group">
                <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Omset Hari Ini</span>
                  <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white font-mono">Rp 42.850.000</p>
                <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                  <span>+18.5% dibanding kemarin</span>
                </p>
              </div>

              {/* Card 2: Orange Accent */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-200 group">
                <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Total Transaksi</span>
                  <div className="p-1 rounded-md bg-orange-500/10 text-orange-400">
                    <ShoppingCart size={16} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white font-mono">318 Struk</p>
                <p className="text-xs text-slate-400 font-semibold mt-2">Tersebar di 4 lokasi aktif</p>
              </div>

              {/* Card 3: Cyan Accent */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-200 group">
                <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Stok & Mutasi</span>
                  <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
                    <ArrowRightLeft size={16} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white font-mono">12 Transfer</p>
                <p className="text-xs text-cyan-400 font-semibold mt-2">Seluruh verifikasi selesai</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
         3. CLIENT LOGOS BAR
         ============================================================ */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80 text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
            Dipercaya oleh 500+ Bisnis Retail & Multi-Cabang
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20 text-slate-400 text-sm font-semibold font-mono tracking-wider">
            <span className="hover:text-orange-400 transition-colors cursor-pointer">SEMBAKO UTAMA</span>
            <span className="hover:text-indigo-400 transition-colors cursor-pointer">WARUNG KOPI KITA</span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">BAKERY & PASTRY</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">MINIMARKET SEJAHTERA</span>
            <span className="hover:text-rose-400 transition-colors cursor-pointer">FASHION BOUTIQUE</span>
          </div>
        </div>
      </section>

      {/* ============================================================
         4. KEY FEATURES GRID (WITH COLOR VARIATIONS & HOVER EFFECTS)
         ============================================================ */}
      <section id="fitur" className="py-24 lg:py-32 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-3">Fitur Utama</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Fitur Lengkap untuk Skalabilitas Bisnis Anda
            </p>
            <p className="text-slate-400 text-base mt-4">
              Dirancang untuk mempermudah transaksi harian kasir hingga manajemen strategis pemilik usaha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`p-8 rounded-2xl bg-slate-900/80 border border-slate-800/90 ${card.hoverBorder} hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${card.badgeBg} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
         5. INTERACTIVE PRODUCT DEMO TAB SHOWCASE
         ============================================================ */}
      <section id="demo" className="py-24 lg:py-32 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-3">Antarmuka Aplikasi</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tampilan Antarmuka POS System
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'pos'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Halaman Kasir (POS)
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dashboard Admin
              </button>
              <button
                onClick={() => setActiveTab('stok')}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'stok'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Transfer & Stok
              </button>
            </div>
          </div>

          {/* Tab content view */}
          <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 max-w-4xl mx-auto shadow-2xl transition-all duration-300">
            {activeTab === 'pos' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <h4 className="text-lg font-bold text-white">Antarmuka Kasir POS Cepat</h4>
                    <p className="text-xs text-slate-400 mt-1">Struktur tampilan optimal untuk kecepatan pelayanan transaksi</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    Kasir Aktif: Budi (Toko Pusat)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/30 transition-colors space-y-2">
                    <p className="font-semibold text-slate-200">Katalog Produk & Barcode</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Dukungan pemindaian barcode cepat, filter kategori visual, dan pencarian produk instan.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/30 transition-colors space-y-2">
                    <p className="font-semibold text-slate-200">Keranjang & Cetak Struk</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Hitung kembalian otomatis, dukungan pembayaran Tunai/QRIS/Debit, dan cetak struk instan.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <h4 className="text-lg font-bold text-white">Dashboard Analitik Real-Time</h4>
                    <p className="text-xs text-slate-400 mt-1">Pemantauan omset dan performa bisnis dari seluruh cabang</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
                    Akses: Super Admin
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/30 transition-colors space-y-2">
                    <p className="font-semibold text-slate-200">Laporan Penjualan</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Statistik transaksi harian, tren pendapatan mingguan, dan grafik perbandingan cabang.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/30 transition-colors space-y-2">
                    <p className="font-semibold text-slate-200">Pengaturan Master Data</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Kelola daftar harga, promosi, data pemasok, serta pengguna sistem dengan rapi.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stok' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <h4 className="text-lg font-bold text-white">Manajemen Mutasi & Transfer Stok</h4>
                    <p className="text-xs text-slate-400 mt-1">Pencatatan distribusi barang antar gudang dan cabang</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                    Multi-Store Inventory
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/30 transition-colors space-y-2">
                    <p className="font-semibold text-slate-200">Dokumen Pengajuan Transfer</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Buat permintaan pengiriman barang dari gudang utama ke lokasi cabang tercatat.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/30 transition-colors space-y-2">
                    <p className="font-semibold text-slate-200">Verifikasi Stok Masuk</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Konfirmasi fisik barang yang diterima untuk menjamin ketepatan jumlah persediaan.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ============================================================
         6. PRICING PLANS (DISTINCT COLOR ACCENTS & HOVER ELEVATION)
         ============================================================ */}
      <section id="harga" className="py-24 lg:py-32 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-3">Paket Harga</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pilihan Layanan Sesuai Skala Bisnis
            </p>
            <p className="text-slate-400 text-base mt-4">
              Biaya transparan tanpa komitmen jangka panjang. Sesuaikan dengan jumlah lokasi toko Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Starter (Slate & Indigo Accent) */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-4">
                  Usaha Tunggal
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <p className="text-xs text-slate-400 mb-6">Cocok untuk usaha tunggal yang baru berkembang</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-extrabold text-white font-mono">Rp 149rb</span>
                  <span className="text-xs text-slate-400">/ bulan</span>
                </div>
                <ul className="space-y-4 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-indigo-400 shrink-0" /> 1 Lokasi Toko
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-indigo-400 shrink-0" /> Hingga 3 Pengguna Kasir
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-indigo-400 shrink-0" /> Laporan Penjualan Standar
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-indigo-400 shrink-0" /> Cetak Struk Bluetooth / USB
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full text-center py-3.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-semibold text-sm transition-colors duration-200"
              >
                Pilih Starter
              </Link>
            </div>

            {/* Pro Business (Vibrant Orange Highlight) */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-orange-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-orange-500/10 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                Paling Populer
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-bold mb-4 mt-2">
                  Multi-Cabang
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pro Business</h3>
                <p className="text-xs text-slate-400 mb-6">Untuk bisnis multi-cabang hingga 5 lokasi</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-extrabold text-white font-mono">Rp 349rb</span>
                  <span className="text-xs text-slate-400">/ bulan</span>
                </div>
                <ul className="space-y-4 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-orange-500 shrink-0" /> Hingga 5 Lokasi Toko
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-orange-500 shrink-0" /> Pengguna & Kasir Unlimited
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-orange-500 shrink-0" /> Fitur Transfer & Mutasi Stok
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-orange-500 shrink-0" /> Laporan Analitik Lengkap
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-orange-500 shrink-0" /> Dukungan Teknis Prioritas
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full text-center py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors duration-200 shadow-md shadow-orange-500/20"
              >
                Coba Pro Business
              </Link>
            </div>

            {/* Enterprise (Cyan/Blue Accent) */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-4">
                  Skala Besar & Franchise
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-xs text-slate-400 mb-6">Untuk jaringan toko skala besar & franchise</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-extrabold text-white font-mono">Kustom</span>
                </div>
                <ul className="space-y-4 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-cyan-400 shrink-0" /> Lokasi Toko Unlimited
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-cyan-400 shrink-0" /> Integrasi API Sistem Perusahaan
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-cyan-400 shrink-0" /> Dedicated Account Manager
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-cyan-400 shrink-0" /> Jaminan SLA Ketersediaan
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full text-center py-3.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-semibold text-sm transition-colors duration-200"
              >
                Hubungi Kami
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
         7. FAQ ACCORDION (SMOOTH TOGGLE ANIMATIONS)
         ============================================================ */}
      <section id="faq" className="py-24 lg:py-32 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-3">FAQ</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pertanyaan yang Sering Diajukan
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Apakah aplikasi ini mendukung pencetakan struk via printer Bluetooth?",
                a: "Ya, POS System mendukung pencetakan struk thermal menggunakan printer Bluetooth, USB, maupun Wi-Fi dari perangkat tablet, laptop, atau smartphone."
              },
              {
                q: "Bagaimana cara kerja transfer stok antar cabang toko?",
                a: "Admin atau Manager dapat membuat dokumen pengajuan transfer barang dari cabang asal ke cabang tujuan. Setelah diverifikasi dan disetujui, jumlah stok di kedua cabang akan terupdate otomatis."
              },
              {
                q: "Apakah saya bisa mengatur pembatasan akses untuk kasir?",
                a: "Tentu saja. Peran Kasir hanya dapat mengakses antarmuka kasir untuk transaksi dan tidak memiliki wewenang untuk mengubah harga master, melihat laporan laba rugi, atau menghapus data stok."
              },
              {
                q: "Bagaimana cara mencoba sistem ini sebelum berlangganan?",
                a: "Anda dapat langsung mencoba demo interaktif aplikasi secara gratis tanpa registrasi rumit melalui tombol 'Coba Demo' di halaman ini."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'bg-slate-900 border-orange-500/40 shadow-lg' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left font-semibold text-white flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-400 border-t border-slate-800/80 pt-4 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================
         8. FINAL CTA BANNER
         ============================================================ */}
      <section className="py-24 lg:py-32 text-center bg-slate-950 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Tingkatkan Efisiensi Bisnis Toko Anda Sekarang
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Mulai mengelola multi-lokasi bisnis dengan antarmuka yang cepat, akurat, dan mudah digunakan.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-base font-bold bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 group"
          >
            <span>Masuk & Coba Demo Kasir</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ============================================================
         9. FOOTER
         ============================================================ */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center">
              <img src="/logo_color.png" alt="POS Logo" className="h-4 w-auto object-contain brightness-0 invert" />
            </div>
            <span className="font-bold text-slate-300 font-mono">POS SYSTEM</span>
          </div>
          <p>© 2026 POS System Enterprises Ltd. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Syarat Ketentuan</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
