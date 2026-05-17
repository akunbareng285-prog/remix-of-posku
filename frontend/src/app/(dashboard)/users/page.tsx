'use client';

import { UserPlus, Shield, Lock, MapPin, Edit, Search, X, Save, Users as UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserData = {
  id: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'KASIR';
  branch: string;
};

const initialUsers: UserData[] = [
  { id: '1', name: 'Budi Admin', role: 'ADMIN', branch: 'pusat' },
  { id: '2', name: 'Siti Manager', role: 'MANAGER', branch: 'depok' },
  { id: '3', name: 'Andi Kasir', role: 'KASIR', branch: 'depok' },
  { id: '4', name: 'Rina Kasir', role: 'KASIR', branch: 'pusat' },
];

const roleConfig = {
  ADMIN: { color: 'bg-purple-50 text-purple-700', bg: 'bg-purple-500', dotColor: 'bg-purple-500' },
  MANAGER: { color: 'bg-blue-50 text-blue-700', bg: 'bg-blue-500', dotColor: 'bg-blue-500' },
  KASIR: { color: 'bg-emerald-50 text-emerald-700', bg: 'bg-emerald-500', dotColor: 'bg-emerald-500' },
};

export default function UsersPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>('');

  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('pos_role');
    setRole(userRole || '');
  }, []);

  const handleEditClick = (user: UserData) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updatedUsers = users.map((u) => (u.id === editingUser.id ? editingUser : u));
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  if (role && role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
          <Lock size={32} className="text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Akses Ditolak</h1>
        <p className="text-sm text-text-muted mt-2 max-w-sm">Hanya Admin yang dapat mengelola Karyawan & Role Akses.</p>
        <button onClick={() => router.push('/')} className="pro-button-primary mt-6">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(searchFilter.toLowerCase()))
    .filter((u) => (roleFilter ? u.role === roleFilter : true))
    .filter((u) => (branchFilter ? u.branch === branchFilter : true));

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Pegawai &amp; Hak Akses</h1>
            <p className="page-subtitle">{users.length} pegawai terdaftar</p>
          </div>
          <button className="pro-button-primary">
            <UserPlus size={16} /> Pegawai Baru
          </button>
        </div>

        <div className="pro-card">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Cari nama pegawai..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pro-input pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pro-select"
            >
              <option value="">Semua Role</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="KASIR">Kasir</option>
            </select>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="pro-select"
            >
              <option value="">Semua Cabang</option>
              <option value="pusat">Pusat</option>
              <option value="depok">Depok</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const config = roleConfig[user.role];
            return (
              <div key={user.id} className="pro-card-elevated p-0 overflow-hidden flex flex-col">
                {/* Header color based on role */}
                <div className={`h-2 ${config.bg}`} />

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="card-title truncate">{user.name}</h3>
                      <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <MapPin size={11} /> {user.branch === 'pusat' ? 'Semua Cabang (Pusat)' : `Cabang ${user.branch}`}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className={`pro-badge ${config.color} flex items-center gap-1.5 w-fit`}>
                      <Shield size={11} /> {user.role}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-3 border-t border-card-border mt-auto">
                    {user.role !== 'ADMIN' && (
                      <select
                        className="pro-select w-full text-xs py-2"
                        value={user.role}
                        onChange={(e) => {
                          const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, role: e.target.value as UserData['role'] } : u));
                          setUsers(updatedUsers);
                        }}
                      >
                        <option value="MANAGER">Manager</option>
                        <option value="KASIR">Kasir</option>
                        <option value="ADMIN">Jadikan Admin</option>
                      </select>
                    )}
                    <button
                      onClick={() => handleEditClick(user)}
                      className="pro-button-secondary w-full text-xs py-2"
                    >
                      <Edit size={13} /> Edit {user.role === 'ADMIN' ? 'Akun' : 'Detail'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <UsersIcon size={32} className="mx-auto text-text-muted mb-2" />
              <p className="text-text-muted font-medium">Tidak ada pegawai ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Edit */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <h2 className="section-title flex items-center gap-2">
                <Edit size={16} className="text-primary" /> Edit Pegawai
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nama Pegawai</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="pro-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Role Akses</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserData['role'] })}
                    className="pro-select w-full"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="KASIR">Kasir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Cabang</label>
                  <select
                    value={editingUser.branch}
                    onChange={(e) => setEditingUser({ ...editingUser, branch: e.target.value })}
                    className="pro-select w-full"
                  >
                    <option value="pusat">Pusat</option>
                    <option value="depok">Depok</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="pro-button-secondary flex-1"
                >
                  Batal
                </button>
                <button type="submit" className="pro-button-primary flex-1">
                  <Save size={16} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
