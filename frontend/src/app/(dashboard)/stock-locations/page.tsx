'use client';

import { useState, useEffect } from 'react';
import { Search, Download, AlertTriangle, MapPin, TrendingDown } from 'lucide-react';

interface Product { id: number; sku: string; name: string; unit?: string; minStock?: number; }
interface Location { id: string; name: string; type: 'store' | 'warehouse'; }
interface StockEntry { productId: number; locationId: string; qty: number; }

const defaultLocations: Location[] = [
  { id: 'LOC-1', name: 'Gudang Utama', type: 'warehouse' },
  { id: 'LOC-2', name: 'Toko Pusat', type: 'store' },
  { id: 'LOC-3', name: 'Cabang Depok', type: 'store' },
];

export default function StockLocationsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('pos_products') || '[]');
    setProducts(savedProducts);

    const savedLocs = localStorage.getItem('pos_locations');
    if (savedLocs) setLocations(JSON.parse(savedLocs));
    else localStorage.setItem('pos_locations', JSON.stringify(defaultLocations));

    // Initialize stock map from pos_stock_map or build from pos_products
    const savedMap = localStorage.getItem('pos_stock_map');
    if (savedMap) {
      setStockMap(JSON.parse(savedMap));
    } else {
      // Seed initial stock from product.stock divided across locations
      const map: Record<string, number> = {};
      savedProducts.forEach((p: any) => {
        const total = p.stock || 0;
        const gudang = Math.round(total * 0.6);
        const toko = Math.round(total * 0.3);
        const depok = total - gudang - toko;
        map[`${p.id}-LOC-1`] = gudang;
        map[`${p.id}-LOC-2`] = toko;
        map[`${p.id}-LOC-3`] = depok;
      });
      setStockMap(map);
      localStorage.setItem('pos_stock_map', JSON.stringify(map));
    }
  }, []);

  const getStock = (productId: number, locationId: string) =>
    stockMap[`${productId}-${locationId}`] ?? 0;

  const getTotal = (productId: number) =>
    locations.reduce((sum, loc) => sum + getStock(productId, loc.id), 0);

  const getMinStock = (p: Product) => p.minStock ?? 10;

  const isLow = (productId: number, locationId: string, product: Product) =>
    getStock(productId, locationId) < getMinStock(product) && getStock(productId, locationId) > 0;

  const handleUpdateStock = (productId: number, locationId: string, val: number) => {
    const key = `${productId}-${locationId}`;
    const updated = { ...stockMap, [key]: Math.max(0, val) };
    setStockMap(updated);
    localStorage.setItem('pos_stock_map', JSON.stringify(updated));
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const displayLocs = locationFilter === 'ALL' ? locations : locations.filter(l => l.id === locationFilter);

  const lowStockCount = products.reduce((count, p) => {
    const hasLow = locations.some(l => isLow(p.id, l.id, p));
    return count + (hasLow ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Stok &amp; <span className="text-primary">Lokasi</span></h1>
          <p className="page-subtitle">Matrix stok produk per lokasi toko/gudang</p>
        </div>
        <div className="flex items-center gap-2">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
              <AlertTriangle size={15} />
              {lowStockCount} produk stok tipis
            </div>
          )}
          <button className="pro-button-secondary">
            <Download size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pro-input pl-10"
          />
        </div>
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="pro-select">
          <option value="ALL">Semua Lokasi</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      {/* Stock Matrix Table */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th className="w-64">Produk</th>
              {displayLocs.map(loc => (
                <th key={loc.id} className="text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} className={loc.type === 'store' ? 'text-primary' : 'text-slate-400'} />
                      <span className={loc.type === 'store' ? 'text-primary' : ''}>{loc.name}</span>
                    </div>
                    <span className="text-[9px] font-normal normal-case tracking-normal text-slate-400">
                      {loc.type === 'store' ? 'TOKO' : 'GUDANG'}
                    </span>
                  </div>
                </th>
              ))}
              {locationFilter === 'ALL' && <th className="text-center font-bold">Total</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={displayLocs.length + 2} className="text-center py-12 text-text-muted">
                  Tidak ada produk ditemukan
                </td>
              </tr>
            ) : filtered.map(product => {
              const total = getTotal(product.id);
              const anyLow = locations.some(l => isLow(product.id, l.id, product));
              return (
                <tr key={product.id} className={anyLow ? 'bg-amber-50/30' : ''}>
                  <td>
                    <p className="font-semibold text-text-primary text-sm">{product.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {product.unit || 'pcs'} · min: {getMinStock(product)}
                    </p>
                  </td>
                  {displayLocs.map(loc => {
                    const qty = getStock(product.id, loc.id);
                    const low = isLow(product.id, loc.id, product);
                    return (
                      <td key={loc.id} className="text-center">
                        <input
                          type="number"
                          value={qty}
                          onChange={e => handleUpdateStock(product.id, loc.id, Number(e.target.value))}
                          className={`w-20 text-center text-sm font-bold py-1.5 px-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20
                            ${low
                              ? 'text-amber-600 border-amber-200 bg-amber-50 focus:border-amber-400'
                              : 'text-text-primary border-slate-200 bg-transparent hover:bg-slate-50 focus:border-primary'
                            }`}
                          min={0}
                        />
                        {low && (
                          <div className="flex justify-center mt-1">
                            <TrendingDown size={11} className="text-amber-500" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {locationFilter === 'ALL' && (
                    <td className="text-center">
                      <span className={`text-sm font-bold ${total === 0 ? 'text-danger' : 'text-text-primary'}`}>
                        {total}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">
        * Nilai berwarna <span className="text-amber-600 font-semibold">oranye</span> menandakan stok di bawah batas minimum. Klik angka untuk edit langsung.
      </p>
    </div>
  );
}
