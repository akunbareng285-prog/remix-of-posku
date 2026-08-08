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
  buyPrice?: number;
  stock: number;
  unit?: string;
  minStock?: number;
  isActive?: boolean;
  image: string;
}

const initialProducts: Product[] = [
  { id: 1, sku: 'KPM01', name: 'Kopi Kenangan Mantan', category: 'MINUMAN', price: 24000, buyPrice: 16000, stock: 12, unit: 'cup', minStock: 10, isActive: true, image: '/products/kopi-kenangan.png' },
  { id: 2, sku: 'RC01', name: 'Roti Coklat', category: 'MAKANAN', price: 15000, buyPrice: 9000, stock: 8, unit: 'bungkus', minStock: 10, isActive: true, image: '/products/roti-coklat.png' },
  { id: 3, sku: 'ET01', name: 'Es Teh Tarik', category: 'MINUMAN', price: 10000, buyPrice: 5000, stock: 25, unit: 'cup', minStock: 15, isActive: true, image: '/products/es-teh-tarik.png' },
  { id: 4, sku: 'MG01', name: 'Mie Goreng Spesial', category: 'MAKANAN', price: 22000, buyPrice: 14000, stock: 5, unit: 'porsi', minStock: 10, isActive: true, image: '/products/mie-goreng.png' },
  { id: 5, sku: 'AM01', name: 'Air Mineral 600ml', category: 'MINUMAN', price: 5000, buyPrice: 2500, stock: 50, unit: 'botol', minStock: 20, isActive: true, image: '/products/air-mineral.png' },
  { id: 6, sku: 'KK01', name: 'Keripik Kentang', category: 'SNACK', price: 12000, buyPrice: 7000, stock: 15, unit: 'bungkus', minStock: 10, isActive: true, image: '/products/keripik-kentang.png' },
];

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [role, setRole] = useState<string>('');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState(['MAKANAN', 'MINUMAN', 'SNACK']);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    sku: '', name: '', category: 'MAKANAN',
    price: 0, buyPrice: 0, stock: 0,
    unit: 'pcs', minStock: 10, isActive: true,
    image: '/products/kopi-kenangan.png',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const userRole = localStorage.getItem('pos_role');
    setRole(userRole || '');

    const savedProducts = localStorage.getItem('pos_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      localStorage.setItem('pos_products', JSON.stringify(initialProducts));
    }
    
    const savedCategories = localStorage.getItem('pos_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
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

  // Save to localStorage whenever products change
  const syncProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('pos_products', JSON.stringify(updatedProducts));
  };

  const syncCategories = (updatedCategories: string[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('pos_categories', JSON.stringify(updatedCategories));
  };

  // === EDIT ===
  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    syncProducts(updated);
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
    const updated = products.filter((p) => p.id !== deletingProduct.id);
    syncProducts(updated);
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
    setToast({ message: `Produk "${name}" berhasil dihapus`, type: 'danger' });
  };

  // === ADD ===
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    const product: Product = { ...newProduct, id: newId };
    const updated = [...products, product];
    syncProducts(updated);
    setIsAddModalOpen(false);
    setNewProduct({ sku: '', name: '', category: 'MAKANAN', price: 0, stock: 0, image: '/products/kopi-kenangan.png' });
    setToast({ message: `Produk "${product.name}" berhasil ditambahkan`, type: 'success' });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim().toUpperCase())) {
      const updated = [...categories, newCategoryName.trim().toUpperCase()];
      syncCategories(updated);
      setToast({ message: `Kategori "${newCategoryName.toUpperCase()}" berhasil ditambahkan`, type: 'success' });
    }
    setIsAddCategoryModalOpen(false);
    setNewCategoryName('');
  };

  // Upload state
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File, target: 'add' | 'edit') => {
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Hanya file gambar yang diperbolehkan', type: 'danger' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (target === 'add') {
        setNewProduct({ ...newProduct, image: result });
      } else if (editingProduct) {
        setEditingProduct({ ...editingProduct, image: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const DragDropZone = ({ image, target }: { image: string; target: 'add' | 'edit' }) => (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file, target);
      }}
      className={`relative group h-40 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden
        ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-200 bg-slate-50/50 hover:border-primary/40 hover:bg-slate-50'}`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, target);
        }}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      {image ? (
        <>
          <Image src={image} alt="Preview" fill className="object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
          <div className="relative z-0 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon size={24} />
            </div>
            <p className="text-xs font-bold text-text-primary">Ganti Foto</p>
            <p className="text-[10px] text-text-muted mt-0.5">Tarik & lepas atau klik</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 mb-2 group-hover:text-primary transition-colors">
            <Plus size={24} />
          </div>
          <p className="text-sm font-bold text-text-primary">Upload Foto Produk</p>
          <p className="text-xs text-text-muted">PNG, JPG atau WEBP (Maks. 2MB)</p>
        </>
      )}
    </div>
  );

  if (role && !['ADMIN', 'MANAGER'].includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
          <Lock size={32} className="text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Akses Ditolak</h1>
        <p className="text-sm text-text-muted mt-2 max-w-sm">Anda tidak memiliki akses ke halaman Produk Master.</p>
        <button onClick={() => router.push('/')} className="pro-button-primary mt-6">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
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
            <h1 className="page-title">Produk <span className="text-primary">Master</span></h1>
            <p className="page-subtitle">{products.length} produk terdaftar</p>
          </div>
          {role === 'ADMIN' && (
            <div className="flex gap-2">
              <button onClick={() => setIsAddCategoryModalOpen(true)} className="pro-button-secondary bg-white text-text-primary border-slate-200 hover:border-primary">
                <Plus size={16} /> Kategori
              </button>
              <button onClick={() => setIsAddModalOpen(true)} className="pro-button-primary">
                <Plus size={16} /> Tambah Produk
              </button>
            </div>
          )}
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
                <th className="text-right">Harga Jual</th>
                <th className="text-right">Harga Beli</th>
                <th className="text-center">Stok</th>
                <th className="text-center">Status</th>
                {['ADMIN', 'MANAGER'].includes(role) && <th className="text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => (
                <tr key={prod.id} className={prod.isActive === false ? 'opacity-50' : ''}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm shrink-0 relative">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{prod.name}</p>
                        <p className="text-xs text-text-muted">{prod.unit || 'pcs'}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="pro-badge-neutral font-mono text-xs">{prod.sku}</span></td>
                  <td><span className="pro-badge-info text-xs">{prod.category}</span></td>
                  <td className="text-right font-semibold text-primary text-sm">Rp {prod.price.toLocaleString('id-ID')}</td>
                  <td className="text-right text-sm text-text-secondary">{prod.buyPrice ? `Rp ${prod.buyPrice.toLocaleString('id-ID')}` : '-'}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`font-semibold text-sm ${prod.stock <= (prod.minStock ?? 10) ? 'text-rose-600' : 'text-text-primary'}`}>
                        {prod.stock}
                      </span>
                      {prod.stock <= (prod.minStock ?? 10) && (
                        <span title="Stok Menipis (Low)"><AlertTriangle size={16} className="text-amber-500" /></span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={prod.isActive !== false ? 'pro-badge-success' : 'pro-badge-neutral'}>
                      {prod.isActive !== false ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  {['ADMIN', 'MANAGER'].includes(role) && (
                    <td>
                      <div className="flex justify-center gap-1">
                        <button onClick={() => handleEditClick(prod)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors" title="Edit produk">
                          <Edit size={14} />
                        </button>
                        {role === 'ADMIN' && (
                          <button onClick={() => handleDeleteClick(prod)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-red-50 transition-colors" title="Hapus produk">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12">
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
      </div>

      {/* ===== EDIT MODAL ===== */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <h2 className="section-title flex items-center gap-2">
                <Edit size={16} className="text-primary" /> Edit Produk
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {/* Product image upload zone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Foto Produk</label>
                <DragDropZone image={editingProduct.image} target="edit" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">SKU</label>
                  {role === 'MANAGER' ? (
                    <div className="w-full text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono">
                      {editingProduct.sku}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                      className="pro-input font-mono"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Kategori</label>
                  {role === 'MANAGER' ? (
                    <div className="w-full text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                      {editingProduct.category}
                    </div>
                  ) : (
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="pro-select w-full"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nama Produk</label>
                {role === 'MANAGER' ? (
                  <div className="w-full text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                    {editingProduct.name}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="pro-input"
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Harga Jual (Rp)</label>
                  {role === 'MANAGER' ? (
                    <div className="w-full text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                      Rp {editingProduct.price.toLocaleString('id-ID')}
                    </div>
                  ) : (
                    <input type="number" value={editingProduct.price} min={0} required
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="pro-input" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Harga Beli (Rp)</label>
                  <input type="number" value={editingProduct.buyPrice ?? 0} min={0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, buyPrice: Number(e.target.value) })}
                    className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Satuan</label>
                  <input type="text" value={editingProduct.unit ?? 'pcs'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="pro-input" placeholder="pcs, botol, kg..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Stok Minimum</label>
                  <input type="number" value={editingProduct.minStock ?? 10} min={0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStock: Number(e.target.value) })}
                    className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Stok Global</label>
                  <input type="number" value={editingProduct.stock} min={0} required
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                  <select value={editingProduct.isActive !== false ? 'active' : 'inactive'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.value === 'active' })}
                    className="pro-select w-full">
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="pro-button-secondary flex-1">Batal</button>
                <button type="submit" className="pro-button-primary flex-1"><Save size={16} /> Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {isDeleteModalOpen && deletingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-danger" />
              </div>
              <h2 className="section-title">Hapus Produk?</h2>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <h2 className="section-title flex items-center gap-2">
                <Plus size={16} className="text-primary" /> Tambah Produk Baru
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {/* Product image upload zone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Foto Produk</label>
                <DragDropZone image={newProduct.image} target="add" />
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
                  <label className="block text-sm font-medium text-text-primary mb-2">Harga Jual (Rp)</label>
                  <input type="number" value={newProduct.price || ''} min={0} required
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="0" className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Harga Beli (Rp)</label>
                  <input type="number" value={newProduct.buyPrice || ''} min={0}
                    onChange={(e) => setNewProduct({ ...newProduct, buyPrice: Number(e.target.value) })}
                    placeholder="0" className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Satuan</label>
                  <input type="text" value={newProduct.unit || 'pcs'}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="pcs, botol, kg..." className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Stok Minimum</label>
                  <input type="number" value={newProduct.minStock ?? 10} min={0}
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })}
                    className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Stok Awal</label>
                  <input type="number" value={newProduct.stock || ''} min={0} required
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    placeholder="0" className="pro-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                  <select value={newProduct.isActive !== false ? 'active' : 'inactive'}
                    onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.value === 'active' })}
                    className="pro-select w-full">
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
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

      {/* ===== ADD CATEGORY MODAL ===== */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-sm animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <h2 className="section-title flex items-center gap-2">
                <Plus size={16} className="text-primary" /> Kategori Baru
              </h2>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nama Kategori</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Contoh: PAKET HEMAT"
                  className="pro-input"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button type="button" onClick={() => setIsAddCategoryModalOpen(false)} className="pro-button-secondary flex-1">
                  Batal
                </button>
                <button type="submit" className="pro-button-primary flex-1">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
