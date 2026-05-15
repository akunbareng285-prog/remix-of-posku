# 02 - Product Knowledge

## Fitur Utama

### 1. Point of Sale (POS)
Antarmuka kasir yang dioptimalkan untuk kecepatan:
- Pencarian produk berdasarkan nama atau SKU.
- Filter kategori produk (Makanan, Minuman, Snack, dll).
- Manajemen keranjang belanja dengan kalkulasi pajak otomatis.
- Proses checkout yang simpel dengan berbagai metode pembayaran (Cash, QRIS, dll).

### 2. Multi-Location Inventory
Sistem manajemen stok yang mendukung banyak titik lokasi:
- **Gudang Utama**: Lokasi pusat penerimaan barang dari supplier.
- **Toko Cabang**: Lokasi titik penjualan (Selling Point).
- **Mutasi Stok**: Melacak perpindahan barang antar lokasi secara detail.

### 3. Master Data Management
- **Produk**: Manajemen detail barang, harga beli/jual, dan batas stok minimum.
- **Supplier**: Database pemasok barang.
- **Users & Roles**: Pengaturan hak akses berdasarkan peran pengguna.
- **Store Settings**: Konfigurasi identitas toko dan cabang.

## Peran Pengguna (User Roles)

| Role | Deskripsi | Hak Akses Utama |
|---|---|---|
| **Admin** | Superuser / Pemilik Bisnis | Akses penuh ke semua fitur, pengaturan, dan manajemen user. |
| **Manager** | Pengelola Toko/Cabang | Hanya dapat mengelola **1 toko spesifik** yang ditugaskan oleh Admin. Dapat melihat stok produk, melakukan mutasi stok, serta mengakses laporan dan dashboard. |
| **Kasir** | Operasional Toko | Fokus pada halaman POS untuk transaksi harian di toko tempat ia ditugaskan. |

## Konsep Bisnis Utama
Aplikasi ini menggunakan konsep **Audit Trail** pada setiap perubahan stok. Setiap kali barang terjual, masuk, atau dipindahkan, sistem mencatatnya dalam tabel `stock_movements`. Hal ini memastikan transparansi dan kemudahan dalam audit stok jika terjadi selisih.
