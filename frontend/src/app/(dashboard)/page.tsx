import Link from 'next/link';

export default function DashboardHome() {
  return (
    <>
      <div className="mb-8 border-b-4 border-black pb-4">
        <h1 className="text-5xl font-black text-black uppercase tracking-tighter leading-none">Dashboard</h1>
        <p className="text-black font-bold mt-2 text-lg uppercase tracking-wide">Ringkasan aktivitas hari ini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Penjualan */}
        <div className="neo-card bg-neo-bg">
          <h2 className="text-sm font-black text-black uppercase mb-1 border-b-[3px] border-black pb-1">Penjualan Hari Ini</h2>
          <p className="text-4xl font-black text-neo-primary mt-2 tracking-tighter">Rp 4.250.000</p>
          <span className="inline-block mt-4 bg-black text-neo-bg px-2 py-1 text-xs font-bold uppercase rounded-md">+12% dari kemarin</span>
        </div>

        {/* Card 2: Transaksi */}
        <div className="neo-card bg-white">
          <h2 className="text-sm font-black text-black uppercase mb-1 border-b-[3px] border-black pb-1">Total Transaksi</h2>
          <p className="text-5xl font-black text-black mt-2 tracking-tighter">42</p>
        </div>

        {/* Card 3: Stok Menipis */}
        <div className="neo-card bg-neo-hover text-neo-bg shadow-[6px_6px_0px_0px_#5E0006]">
          <h2 className="text-sm font-black text-neo-bg uppercase mb-1 border-b-[3px] border-black pb-1">Produk Stok Tipis</h2>
          <p className="text-5xl font-black text-neo-bg mt-2 tracking-tighter">
            5 <span className="text-xl">Item</span>
          </p>
          <span className="inline-block mt-4 bg-black text-white px-2 py-1 text-xs font-bold uppercase border-2 border-white rounded-md">Segera re-stock</span>
        </div>
      </div>

      {/* Area Aksi Cepat */}
      <section className="neo-card bg-neo-bg mb-8">
        <h2 className="text-2xl font-black text-black uppercase mb-6 border-b-[4px] border-black pb-2 tracking-tight">Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/pos" className="neo-button-primary h-24 text-lg flex items-center justify-center text-center">
            + TRANSAKSI BARU
          </Link>
          <button className="neo-button-secondary h-24 text-base">BARANG MASUK</button>
          <button className="neo-button-secondary h-24 text-base">TRANSFER STOK</button>
          <button className="neo-button-secondary h-24 text-base bg-black !text-white hover:bg-gray-800">LAPORAN HARIAN</button>
        </div>
      </section>
    </>
  );
}
