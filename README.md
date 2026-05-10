# Multi-Location POS

Sistem kasir (Point of Sale) multi-lokasi yang dibangun dengan TanStack Start, React, Supabase, dan Cloudflare Workers.

## Struktur Proyek

```
multi-location-pos/
├── frontend/               # Aplikasi web (TanStack Start + React)
│   ├── src/
│   │   ├── components/     # Komponen UI (layout + shadcn/ui)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── integrations/
│   │   │   └── supabase/   # Supabase client & types
│   │   ├── lib/            # Utilities & server functions
│   │   ├── routes/         # Halaman aplikasi (file-based routing)
│   │   └── styles.css      # Global styles (Tailwind CSS)
│   ├── package.json
│   ├── vite.config.ts
│   └── wrangler.jsonc      # Cloudflare Workers config
│
├── backend/                # Konfigurasi database & API
│   ├── supabase/
│   │   ├── config.toml     # Supabase CLI config
│   │   └── migrations/     # SQL migration files
│   └── .env
│
├── .gitignore
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Setup environment

```bash
cp backend/.env frontend/.env
# Edit frontend/.env dengan nilai yang sesuai
```

### 3. Jalankan development server

```bash
cd frontend
npm run dev
```

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | TanStack Start (SSR) |
| UI | React 19 + shadcn/ui + Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + Google OAuth) |
| Deployment | Cloudflare Workers |
| Routing | TanStack Router (file-based) |

## Fitur

- 🏪 Manajemen multi-lokasi (cabang)
- 💰 Point of Sale (kasir)
- 📦 Manajemen stok & produk
- 📊 Laporan penjualan & transaksi
- 👥 Manajemen pengguna & peran (admin, kasir, gudang, pemilik)
- 🔐 Autentikasi aman via Supabase
