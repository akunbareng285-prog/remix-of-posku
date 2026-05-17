'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Save, Trash2, Clock, Package, ChevronRight } from 'lucide-react';

interface Product { id: number; name: string; sku: string; buyPrice?: number; unit?: string; }
interface Supplier { id: string; name: string; }
interface Location { id: string; name: string; }
interface StockInItem { productId: number; productName: string; sku: string; qty: number; buyPrice: number; unit: string; }
interface StockInDoc {
  id: string; date: string; supplierId: string; supplierName: string;
  locationId: string; locationName: string; notes: string;
  items: StockInItem[]; totalQty: number; totalCost: number;
}

const defaultSuppliers: Supplier[] = [
  { id: 'SUP-1', name: 'PT Sinar Jaya' },
  { id: 'SUP-2', name: 'CV Makmur Sentosa' },
  { id: 'SUP-3', name: 'Toko Grosir Utama' },
];
const defaultLocations: Location[] = [
  { id: 'LOC-1', name: 'Gudang Utama' },
  { id: 'LOC-2', name: 'Toko Pusat' },
  { id: 'LOC-3', name: 'Cabang Depok' },
];

export default function BarangMasukPage() {
  const [tab, setTab] = useState<'form' | 'history'>('form');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(defaultSuppliers);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [history, setHistory] = useState<StockInDoc[]>([]);

  const [supplierId, setSupplierId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<StockInItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('pos_products') || '[]');
    setProducts(p);
    const s = localStorage.getItem('pos_suppliers');
    if (s) setSuppliers(JSON.parse(s));
    const l = localStorage.getItem('pos_locations');
    if (l) setLocations(JSON.parse(l));
    const h = localStorage.getItem('pos_stock_in');
    if (h) setHistory(JSON.parse(h));
  }, []);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku?.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 8);

  const addItem = (product: Product) => {
    const exists = items.find(i => i.productId === product.id);
    if (exists) return;
    setItems(prev => [...prev, {
      productId: product.id, productName: product.name,
      sku: product.sku, qty: 1,
      buyPrice: product.buyPrice || 0, unit: product.unit || 'pcs'
    }]);
    setProductSearch('');
    setShowProductList(false);
  };

  const updateItem = (idx: number, field: keyof StockInItem, value: number | string) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  };

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const totalQty = items.reduce((s, i) => s + Number(i.qty), 0);
  const totalCost = items.reduce((s, i) => s + Number(i.qty) * Number(i.buyPrice), 0);

  const handleSave = () => {
    if (!supplierId || !locationId || items.length === 0) {
      alert('Lengkapi supplier, lokasi, dan minimal 1 produk!');
      return;
    }
    const sup = suppliers.find(s => s.id === supplierId);
    const loc = locations.find(l => l.id === locationId);
    const doc: StockInDoc = {
      id: `BM-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('id-ID'),
      supplierId, supplierName: sup?.name || '-',
      locationId, locationName: loc?.name || '-',
      notes, items, totalQty, totalCost
    };

    // Update stock map
    const stockMap: Record<string, number> = JSON.parse(localStorage.getItem('pos_stock_map') || '{}');
    items.forEach(item => {
      const key = `${item.productId}-${locationId}`;
      stockMap[key] = (stockMap[key] || 0) + Number(item.qty);
    });
    localStorage.setItem('pos_stock_map', JSON.stringify(stockMap));

    // Save history
    const newHistory = [doc, ...history];
    setHistory(newHistory);
    localStorage.setItem('pos_stock_in', JSON.stringify(newHistory));

    // Reset form
    setSupplierId(''); setLocationId(''); setNotes(''); setItems([]);
    setTab('history');
    alert('Barang masuk berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Barang Masuk</h1>
        <p className="page-subtitle">Catat penerimaan barang dari supplier</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {(['form', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
            {t === 'form' ? 'Tambah Barang Masuk' : `Riwayat (${history.length})`}
          </button>
        ))}
      </div>

      {tab === 'form' ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-5">
            {/* Info Penerimaan */}
            <div className="pro-card">
              <h3 className="card-title mb-5">Informasi Penerimaan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Supplier</label>
                  <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="pro-select w-full">
                    <option value="">Pilih supplier...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Lokasi Tujuan <span className="text-danger">*</span></label>
                  <select value={locationId} onChange={e => setLocationId(e.target.value)} className="pro-select w-full">
                    <option value="">Pilih lokasi...</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-2">Catatan</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="Catatan penerimaan..." className="pro-input resize-none" />
              </div>
            </div>

            {/* Tambah Produk */}
            <div className="pro-card">
              <h3 className="card-title mb-4">Tambah Produk</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
                <input type="text" placeholder="Cari produk..." value={productSearch}
                  onChange={e => { setProductSearch(e.target.value); setShowProductList(true); }}
                  onFocus={() => setShowProductList(true)}
                  className="pro-input pl-10" />
                {showProductList && productSearch && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    {filteredProducts.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-text-muted">Produk tidak ditemukan</p>
                    ) : filteredProducts.map(p => (
                      <button key={p.id} onClick={() => addItem(p)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors">
                        <Package size={15} className="text-text-muted shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                          <p className="text-xs text-text-muted">{p.sku}</p>
                        </div>
                        <ChevronRight size={14} className="text-text-muted shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <Package size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Belum ada produk ditambahkan</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_80px_120px_80px_36px] gap-2 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider pb-2 border-b border-slate-100">
                    <span>Produk</span><span className="text-center">Qty</span><span className="text-center">Harga Beli</span><span className="text-center">Satuan</span><span />
                  </div>
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_80px_120px_80px_36px] gap-2 items-center p-2 rounded-lg bg-slate-50/60">
                      <div>
                        <p className="text-sm font-medium text-text-primary truncate">{item.productName}</p>
                        <p className="text-xs text-text-muted">{item.sku}</p>
                      </div>
                      <input type="number" value={item.qty} min={1}
                        onChange={e => updateItem(idx, 'qty', Number(e.target.value))}
                        className="pro-input text-center text-sm py-1.5 px-2" />
                      <input type="number" value={item.buyPrice} min={0}
                        onChange={e => updateItem(idx, 'buyPrice', Number(e.target.value))}
                        className="pro-input text-sm py-1.5 px-2" />
                      <input type="text" value={item.unit}
                        onChange={e => updateItem(idx, 'unit', e.target.value)}
                        className="pro-input text-sm py-1.5 px-2" />
                      <button onClick={() => removeItem(idx)} className="p-1.5 text-text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="pro-card h-fit sticky top-4">
            <h3 className="card-title mb-5">Ringkasan</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Jumlah Item</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total Qty</span>
                <span className="font-semibold">{totalQty}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <span className="text-sm font-semibold text-text-primary">Total Biaya</span>
                <span className="text-base font-bold text-primary">Rp {totalCost.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button onClick={handleSave} className="pro-button-primary w-full">
              <Save size={16} /> Simpan Barang Masuk
            </button>
          </div>
        </div>
      ) : (
        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>ID & Tanggal</th>
                <th>Supplier</th>
                <th>Lokasi</th>
                <th className="text-center">Item</th>
                <th className="text-center">Total Qty</th>
                <th className="text-right">Total Biaya</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <Clock size={28} className="mx-auto text-text-muted mb-2" />
                  <p className="text-text-muted">Belum ada riwayat barang masuk</p>
                </td></tr>
              ) : history.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <p className="font-semibold text-sm">{doc.id}</p>
                    <p className="text-xs text-text-muted">{doc.date}</p>
                  </td>
                  <td className="text-sm">{doc.supplierName}</td>
                  <td><span className="pro-badge-info">{doc.locationName}</span></td>
                  <td className="text-center text-sm font-medium">{doc.items.length}</td>
                  <td className="text-center text-sm font-medium">{doc.totalQty}</td>
                  <td className="text-right text-sm font-bold text-primary">Rp {doc.totalCost.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
