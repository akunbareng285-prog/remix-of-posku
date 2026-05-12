# 05 - Development Guide

## Persyaratan Sistem
- **Node.js**: v18 atau lebih baru.
- **npm / yarn**: Package manager.
- **Supabase CLI**: Untuk manajemen database lokal dan migrasi.

## Cara Menjalankan Proyek

### 1. Kloning Proyek
```bash
git clone [repository-url]
cd multi-location-pos
```

### 2. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Akses di `http://localhost:3000`.

### 3. Jalankan Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
Akses di `http://localhost:4000` (default NestJS).

## Konvensi Kode
- **Naming**: Gunakan `PascalCase` untuk komponen React dan `camelCase` untuk fungsi/variabel.
- **Styling**: Gunakan utilitas Tailwind CSS. Hindari menulis CSS kustom kecuali sangat diperlukan (seperti untuk animasi kompleks).
- **TypeScript**: Gunakan interface/type untuk setiap data yang diproses untuk menghindari error runtime.

## Status Implementasi Saat Ini (Per Mei 2026)
> [!IMPORTANT]
> Saat ini sebagian besar data di Frontend masih bersifat **Mock Data** (menggunakan localStorage dan initial state). Integrasi penuh dengan API Supabase dan Backend NestJS adalah langkah pengembangan selanjutnya.

### Daftar Pekerjaan (Todo):
- [ ] Menghubungkan Form Login dengan Supabase Auth.
- [ ] Mengganti fetch data statis dengan React Query yang terhubung ke database.
- [ ] Implementasi logic stok di sisi backend untuk keamanan transaksi.
- [ ] Pembuatan sistem cetak struk (Receipt Printing).
