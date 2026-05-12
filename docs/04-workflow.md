# 04 - Project Workflow

## 1. Alur Transaksi Kasir (POS Flow)
1. **Login**: Kasir masuk ke aplikasi.
2. **Scan/Cari**: Kasir mencari produk melalui input search atau scan barcode.
3. **Tambah ke Keranjang**: Produk ditambahkan ke list transaksi, stok sementara divalidasi.
4. **Pembayaran**: Kasir menekan tombol "Bayar", memilih metode pembayaran.
5. **Finalisasi**: 
   - Data transaksi disimpan ke tabel `transactions` & `transaction_items`.
   - Stok di `product_stocks` dikurangi sesuai lokasi toko.
   - Log pengurangan stok dicatat di `stock_movements`.

## 2. Alur Mutasi Stok (Stock Movement Flow)
1. **Request**: Admin atau Manager membuat permintaan pindah barang (Transfer).
2. **Source validation**: Sistem mengecek ketersediaan stok di lokasi asal.
3. **Execution**: 
   - Stok di lokasi asal dikurangi.
   - Stok di lokasi tujuan ditambah.
   - Log perpindahan dicatat di `stock_movements` dengan tipe 'transfer'.

## 3. Alur Autentikasi
1. **User Sign-up/In**: Dilakukan melalui Supabase Auth.
2. **Profile Creation**: Setelah auth berhasil, data profil tambahan (seperti role dan nama lengkap) diambil dari tabel `profiles`.
3. **Authorization**: Layout aplikasi akan menampilkan menu navigasi yang berbeda berdasarkan `role` yang tersimpan di profil user.

## 4. Alur Pengembangan (Development Workflow)
1. **Database Change**: Edit file SQL di folder `supabase/migrations`.
2. **Apply DB**: Jalankan `supabase db push` (atau via Dashboard).
3. **Frontend Change**: Update UI atau logic di folder `frontend`.
4. **Backend Change**: Update API (jika ada logic server-side khusus) di folder `backend`.
