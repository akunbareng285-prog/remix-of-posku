'use client';

import { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, Save, Trash2, Clock, Package, ChevronRight, AlertTriangle } from 'lucide-react';

interface Product { id: number; name: string; sku: string; unit?: string; }
interface Location { id: string; name: string; }
interface TransferItem { productId: number; productName: string; sku: string; qty: number; unit: string; available: number; }
interface TransferDoc {
  id: string; date: string;
  fromLocationId: string; fromLocationName: string;
  toLocationId: string; toLocationName: string;
  notes: string; items: TransferItem[]; totalQty: number;
}

const defaultLocations: Location[] = [
  { id: 'LOC-1', name: 'Gudang Utama' },
  { id: 'LOC-2', name: 'Toko Pusat' },
  { id: 'LOC-3', name: 'Cabang Depok' },
];

export default function TransferStokPage() {
  const [tab, setTab] = useState<'form' | 'history'>('form');
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<TransferDoc[]>([]);

  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('pos_products') || '[]'));
    const l = localStorage.getItem('pos_locations');
    if (l) setLocations(JSON.parse(l));
    setStockMap(JSON.parse(localStorage.getItem('pos_stock_map') || '{}'));
    const h = localStorage.getItem('pos_transfers');
    if (h) setHistory(JSON.parse(h));
  }, []);

  const getStock = (productId: number, locationId: string) =>
    stockMap[`${productId}-${locationId}`] ?? 0;

  const availableProducts = products.filter(p =>
    fromId ? getStock(p.id, fromId) > 0 : true
  ).filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku?.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 8);

  const addItem = (product: Product) => {
    if (items.find(i => i.productId === product.id)) return;
    if (!fromId) { alert('Pilih lokasi asal terlebih dahulu!'); return; }
    setItems(prev => [...prev, {
      productId: product.id, productName: product.name,
      sku: product.sku, qty: 1,
      unit: product.unit || 'pcs',
      available: getStock(product.id, fromId)
    }]);
    setProductSearch(''); setShowList(false);
  };

  const updateQty = (idx: number, qty: number) => {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      if (qty > it.available) { alert(`Stok tersedia hanya ${it.available}`); return it; }
      return { ...it, qty: Math.max(1, qty) };
    }));
  };

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const swap = () => { const tmp = fromId; setFromId(toId); setToId(tmp); setItems([]); };

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const hasQtyError = items.some(i => i.qty > i.available);

  const handleSave = () => {
    if (!fromId || !toId || fromId === toId) { alert('Pilih lokasi asal dan tujuan yang berbeda!'); return; }
    if (items.length === 0) { alert('Tambahkan minimal 1 produk!'); return; }
    if (hasQtyError) { alert('Ada produk dengan qty melebihi stok tersedia!'); return; }

    const fromLoc = locations.find(l => l.id === fromId);
    const toLoc = locations.find(l => l.id === toId);

    const doc: TransferDoc = {
      id: `TRF-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('id-ID'),
      fromLocationId: fromId, fromLocationName: fromLoc?.name || '-',
      toLocationId: toId, toLocationName: toLoc?.name || '-',
      notes, items, totalQty,
    };

    // Update stock map
    const updated = { ...stockMap };
    items.forEach(item => {
      const fromKey = `${item.productId}-${fromId}`;
      const toKey = `${item.productId}-${toId}`;
      updated[fromKey] = (updated[fromKey] || 0) - item.qty;
      updated[toKey] = (updated[toKey] || 0) + item.qty;
    });
    setStockMap(updated);
    localStorage.setItem('pos_stock_map', JSON.stringify(updated));

    const newHistory = [doc, ...history];
    setHistory(newHistory);
    localStorage.setItem('pos_transfers', JSON.stringify(newHistory));

    setFromId(''); setToId(''); setNotes(''); setItems([]);
    setTab('history');
    alert('Transfer stok berhasil diproses!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Transfer <span className="text-primary">Stok</span></h1>
        <p className="page-subtitle">Pindahkan stok antar lokasi toko / gudang</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {(['form', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
            {t === 'form' ? 'Buat Transfer' : `Riwayat Transfer (${history.length})`}
          </button>
        ))}
      </div>

      {tab === 'form' ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-5">
            {/* Rute Transfer */}
            <div className="pro-card">
              <h3 className="card-title mb-5">Rute Transfer</h3>
              <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-primary mb-2">Dari Lokasi</label>
                  <select value={fromId} onChange={e => { setFromId(e.target.value); setItems([]); }} className="pro-select w-full">
                    <option value="">Pilih lokasi asal...</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <button onClick={swap} className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-text-muted hover:text-primary transition-all mb-0.5 shrink-0">
                  <ArrowRightLeft size={18} />
                </button>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-primary mb-2">Ke Lokasi</label>
                  <select value={toId} onChange={e => setToId(e.target.value)} className="pro-select w-full">
                    <option value="">Pilih lokasi tujuan...</option>
                    {locations.filter(l => l.id !== fromId).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-2">Catatan</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="Alasan transfer..." className="pro-input resize-none" />
              </div>
            </div>

            {/* Produk */}
            {/* Produk */}
            <div className="pro-card">
              <h3 className="card-title mb-5">Produk Yang Ditransfer</h3>
              <div className="relative mb-6">
                <div className="relative">
                  <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${!fromId ? 'text-slate-300' : 'text-slate-400'}`} size={16} />
                  <input type="text" placeholder="Cari nama atau SKU produk untuk ditransfer..."
                    value={productSearch}
                    onChange={e => { setProductSearch(e.target.value); setShowList(true); }}
                    onFocus={() => setShowList(true)}
                    disabled={!fromId}
                    className={`pro-input pl-10 py-2.5 text-sm w-full transition-all ${
                      !fromId 
                        ? 'bg-slate-50 border-slate-200 text-slate-400 placeholder:text-slate-300 cursor-not-allowed opacity-80 shadow-none' 
                        : 'focus:border-primary focus:ring-primary/20'
                    }`} 
                  />
                </div>
                {showList && productSearch && fromId && (
                  <div className="absolute top-[42px] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-30 overflow-hidden">
                    {availableProducts.length === 0
                      ? <p className="px-5 py-4 text-sm text-slate-500 text-center font-medium">Tidak ada produk atau stok kosong di lokasi ini.</p>
                      : availableProducts.map(p => (
                        <button key={p.id} onClick={() => addItem(p)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-100 last:border-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Package size={14} className="text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate">{p.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{p.sku}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Tersedia</span>
                            <span className="text-xs font-black text-primary">{getStock(p.id, fromId)} {p.unit || 'pcs'}</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 ml-1 shrink-0" />
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {items.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl py-12 px-6 flex flex-col items-center justify-center bg-slate-50/50 text-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-300">
                    <Package size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-700 mb-1">Belum ada produk</p>
                  <p className="text-xs text-slate-500 max-w-[200px]">Cari dan pilih produk di atas untuk ditambahkan ke daftar transfer.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_90px_90px_36px] gap-2 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider pb-2 border-b border-slate-100">
                    <span>Produk</span><span className="text-center">Tersedia</span><span className="text-center">Transfer</span><span />
                  </div>
                  {items.map((item, idx) => (
                    <div key={idx} className={`grid grid-cols-[1fr_90px_90px_36px] gap-2 items-center p-2.5 rounded-lg ${item.qty > item.available ? 'bg-red-50 border border-red-200' : 'bg-slate-50/60'}`}>
                      <div>
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-text-muted">{item.unit}</p>
                      </div>
                      <span className="text-center text-sm font-semibold text-text-secondary">{item.available}</span>
                      <input type="number" value={item.qty} min={1} max={item.available}
                        onChange={e => updateQty(idx, Number(e.target.value))}
                        className={`pro-input text-center text-sm py-1.5 px-2 ${item.qty > item.available ? 'border-red-400 focus:ring-red-200' : ''}`} />
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
            <h3 className="card-title mb-5">Ringkasan Transfer</h3>
            <div className="space-y-3 mb-6">
              {fromId && toId && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm">
                  <p className="text-xs text-text-muted mb-1">Rute</p>
                  <p className="font-semibold text-text-primary">{locations.find(l => l.id === fromId)?.name}</p>
                  <div className="text-primary my-1">↓</div>
                  <p className="font-semibold text-text-primary">{locations.find(l => l.id === toId)?.name}</p>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Item</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total Qty</span>
                <span className="font-semibold">{totalQty}</span>
              </div>
            </div>
            <button onClick={handleSave} disabled={hasQtyError || items.length === 0}
              className="pro-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowRightLeft size={16} /> Proses Transfer
            </button>
          </div>
        </div>
      ) : (
        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>ID & Tanggal</th>
                <th>Dari Lokasi</th>
                <th>Ke Lokasi</th>
                <th className="text-center">Item</th>
                <th className="text-center">Total Qty</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <Clock size={28} className="mx-auto text-text-muted mb-2" />
                  <p className="text-text-muted">Belum ada riwayat transfer</p>
                </td></tr>
              ) : history.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <p className="font-semibold text-sm">{doc.id}</p>
                    <p className="text-xs text-text-muted">{doc.date}</p>
                  </td>
                  <td><span className="pro-badge-neutral text-xs">{doc.fromLocationName}</span></td>
                  <td><span className="pro-badge-info text-xs">{doc.toLocationName}</span></td>
                  <td className="text-center text-sm font-medium">{doc.items.length}</td>
                  <td className="text-center text-sm font-bold text-primary">{doc.totalQty}</td>
                  <td className="text-sm text-text-muted max-w-[160px] truncate">{doc.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
