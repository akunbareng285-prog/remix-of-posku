# 03 - Technical Architecture

## Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router).
- **Styling**: Tailwind CSS 4.0 (Modern CSS-in-JS utility approach).
- **Icons**: Lucide React.
- **State Management**: React Query (TanStack Query) & Local State.
- **UI Design System**: Custom Neo-Brutalism (Border tebal, shadow tajam, warna kontras).

### Backend
- **Framework**: NestJS (TypeScript Node.js framework).
- **Architecture**: Modular structure (Controllers, Services, Modules).
- **Authentication**: Supabase Auth (Integrated with Frontend).

### Database
- **Platform**: Supabase (PostgreSQL).
- **ORM/Query**: Supabase Client (Direct PostgREST).
- **Migrations**: SQL-based migrations managed via Supabase CLI.

## Struktur Folder
```text
multi-location-pos/
├── backend/            # Aplikasi NestJS (API & Logic)
├── frontend/           # Aplikasi Next.js (Web Interface)
│   └── src/
│       ├── app/        # Next.js App Router (Pages & Layouts)
│       ├── components/ # Shared UI Components
│       └── lib/        # Utilities & Shared Logic
├── supabase/           # Konfigurasi Database & Migrasi
└── docs/               # Dokumentasi Proyek
```

## Desain Database (ERD Highlights)
Beberapa tabel kunci dalam sistem:
- **`profiles`**: Ekstensi data user dari Supabase Auth.
- **`products`**: Data master barang.
- **`locations`**: Definisi gudang dan toko cabang.
- **`product_stocks`**: Stok barang spesifik di lokasi tertentu.
- **`transactions`**: Header transaksi penjualan.
- **`stock_movements`**: Log setiap perubahan stok barang.

## Design System: Neo-Brutalism
Aplikasi ini menggunakan tema warna khusus pada latar belakang putih:
- **Background**: `#ffffff`
- **Primary**: `#5644FF` (Ungu)
- **Contrast/Sidebar**: `#111827` (Navy Gelap)
- **Accent/Alert**: `#FF3366` (Pink)
- **Focus**: `#FFC107` (Kuning)
- **Borders**: `3px` atau `4px` solid hitam dengan radius `rounded-xl`.
