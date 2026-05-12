'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Lock, Plus, Package, X, Save, AlertTriangle, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const initialProducts: Product[] = [
  { id: 1, sku: 'KPM01', name: 'Kopi Kenangan Mantan', category: 'MINUMAN', price: 24000, stock: 12, image: '/products/kopi-kenangan.png' },
  { id: 2, sku: 'RC01', name: 'Roti Coklat', category: 'MAKANAN', price: 15000, stock: 8, image: '/products/roti-coklat.png' },
  { id: 3, sku: 'ET01', name: 'Es Teh Tarik', category: 'MINUMAN', price: 10000, stock: 25, image: '/products/es-teh-tarik.png' },
  { id: 4, sku: 'MG01', name: 'Mie Goreng Spesial', category: 'MAKANAN', price: 22000, stock: 5, image: '/products/mie-goreng.png' },
  { id: 5, sku: 'AM01', name: 'Air Mineral 600ml', category: 'MINUMAN', price: 5000, stock: 50, image: '/products/air-mineral.png' },
  { id: 6, sku: 'KK01', name: 'Keripik Kentang', category: 'SNACK', price: 12000, stock: 15, image: '/products/keripik-kentang.png' },
];

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [role, setRole] = useState<string>('');
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    sku: '',
    name: '',
    category: 'MAKANAN',
    price: 0,
    stock: 0,
    image: '/products/kopi-kenangan.png',
  });

  // Success toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('pos_role');
    setRole(userRole || '');
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // === EDIT ===
  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setToast({ message: `Produk "${editingProduct.name}" berhasil diperbarui`, type: 'success' });
  };

  // === DELETE ===
  const handleDeleteClick = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    const name = deletingProduct.name;
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
    setToast({ message: `Produk "${name}" berhasil dihapus`, type: 'danger' });
  };

  // === ADD ===
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    const product: Product = { ...newProduct, id: newId };
    setProducts((prev) => [...prev, product]);
    setIsAddModalOpen(false);
    setNewProduct({ sku: '', name: '', category: 'MAKANAN', price: 0, stock: 0, image: '/products/kopi-kenangan.png' });
    setToast({ message: `Produk "${product.name}" berhasil ditambahkan`, type: 'success' });
  };

  const categories = ['MAKANAN', 'MINUMAN', 'SNACK'];
  const availableImages = [
    { label: 'Kopi', value: '/products/kopi-kenangan.png' },
    { label: 'Roti', value: '/products/roti-coklat.png' },
    { label: 'Es Teh', value: '/products/es-teh-tarik.png' },
    { label: 'Mie Goreng', value: '/products/mie-goreng.png' },
    { label: 'Air Mineral', value: '/products/air-mineral.png' },
    { label: 'Keripik', value: '/products/keripik-kentang.png' },
  ];

  if (role && role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
          <Lock size={32} className="text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Akses Ditolak</h1>
        <p className="text-sm text-text-muted mt-2 max-w-sm">Hanya Admin yang dapat mengelola Produk Master.</p>
        <button onClick={() => router.push('/')} className="pro-button-primary mt-6">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg border animate-slide-in flex items-center gap-3 text-sm font-medium
          ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Produk Master</h1>
          <p className="text-sm text-text-muted mt-1">{products.length} produk terdaftar</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="pro-button-primary">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Cari nama atau SKU produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pro-input pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="pro-select"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th>SKU</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok Global</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => (
              <tr key={prod.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-card-border shrink-0 relative">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <span className="font-semibold text-text-primary">{prod.name}</span>
                  </div>
                </td>
                <td>
                  <span className="pro-badge-neutral font-mono">{prod.sku}</span>
                </td>
                <td>
                  <span className={`pro-badge-info`}>{prod.category}</span>
                </td>
                <td className="font-semibold text-primary">Rp {prod.price.toLocaleString('id-ID')}</td>
                <td>
                  <span className={`font-semibold ${prod.stock <= 10 ? 'text-danger' : 'text-text-primary'}`}>
                    {prod.stock}
                    {prod.stock <= 10 && (
                      <span className="ml-1.5 pro-badge-warning text-[10px]">Low</span>
                    )}
                  </span>
                </td>
                <td>
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                      title="Edit produk"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(prod)}
                      className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-red-50 transition-colors"
                      title="Hapus produk"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Package size={32} className="text-text-muted mb-2" />
                    <p className="text-text-muted font-medium">Tidak ada produk ditemukan</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Edit size={18} className="text-primary" /> Edit Produk
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {/* Product image preview */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-card-border relative shrink-0">
                  <Image
                    src={editingProduct.image}
                    alt={editingProduct.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Foto Produk</label>
                  <select
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="pro-select w-full text-sm py-2"
                  >
                    {availableImages.map((img) => (
                      <option key={img.value} value={img.value}>{img.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">SKU</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                    className="pro-input font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Kategori</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="pro-select w-full"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nama Produk</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="pro-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Harga (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="pro-input"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Stok Global</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="pro-input"
                    required
                    min={0}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="pro-button-secondary flex-1">
                  Batal
                </button>
                <button type="submit" className="pro-button-primary flex-1">
                  <Save size={16} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {isDeleteModalOpen && deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-danger" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Hapus Produk?</h2>
              <p className="text-sm text-text-muted mb-1">
                Anda akan menghapus produk berikut secara permanen:
              </p>

              <div className="flex items-center gap-3 p-3 mt-4 rounded-xl bg-slate-50 border border-card-border">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-card-border relative shrink-0">
                  <Image
                    src={deletingProduct.image}
                    alt={deletingProduct.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{deletingProduct.name}</p>
                  <p className="text-xs text-text-muted">{deletingProduct.sku} • {deletingProduct.category}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { setIsDeleteModalOpen(false); setDeletingProduct(null); }}
                className="pro-button-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-danger text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 justify-center flex-1"
              >
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD PRODUCT MODAL ===== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Plus size={18} className="text-primary" /> Tambah Produk Baru
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {/* Image selector */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Foto Produk</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableImages.map((img) => (
                    <button
                      key={img.value}
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, image: img.value })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all
                        ${newProduct.image === img.value ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-card-border hover:border-slate-300'}`}
                    >
                      <Image src={img.value} alt={img.label} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABC01"
                    className="pro-input font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Kategori</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="pro-select w-full"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nama Produk</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Nama produk..."
                  className="pro-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Harga (Rp)</label>
                  <input
                    type="number"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="0"
                    className="pro-input"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Stok Awal</label>
                  <input
                    type="number"
                    value={newProduct.stock || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    placeholder="0"
                    className="pro-input"
                    required
                    min={0}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="pro-button-secondary flex-1">
                  Batal
                </button>
                <button type="submit" className="pro-button-primary flex-1">
                  <Plus size={16} /> Tambah Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
