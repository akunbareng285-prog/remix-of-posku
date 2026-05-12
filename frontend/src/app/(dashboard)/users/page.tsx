'use client';

import { UserPlus, Shield, Lock, MapPin, Edit, Search, X, Save } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <div className="p-6 bg-[#5644FF] text-white border-[4px] border-black shadow-[6px_6px_0px_0px_#000] mb-6 inline-block rounded-xl">
          <Lock size={64} className="stroke-[3px]" />
        </div>
        <h1 className="text-4xl font-black uppercase text-black">Akses Ditolak</h1>
        <p className="text-xl font-bold uppercase mt-2">Hanya Admin yang dapat mengelola Karyawan & Role Akses.</p>
        <button onClick={() => router.push('/')} className="neo-button-primary mt-8">
          KEMBALI KE DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Pegawai & Hak Akses</h1>
        <button className="neo-button-primary flex items-center gap-2">
          <UserPlus size={20} className="stroke-[3px]" /> PEGAWAI BARU
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-black/50 stroke-[3px]" size={20} />
          <input
            type="text"
            placeholder="Cari nama pegawai..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all bg-white rounded-xl"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border-[3px] border-black px-4 font-black uppercase bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all rounded-xl cursor-pointer"
        >
          <option value="">Semua Role</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="KASIR">Kasir</option>
        </select>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border-[3px] border-black px-4 font-black uppercase bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all rounded-xl cursor-pointer"
        >
          <option value="">Semua Cabang</option>
          <option value="pusat">Pusat</option>
          <option value="depok">Depok</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          .filter((u) => u.name.toLowerCase().includes(searchFilter.toLowerCase()))
          .filter((u) => (roleFilter ? u.role === roleFilter : true))
          .filter((u) => (branchFilter ? u.branch === branchFilter : true))
          .map((user) => (
            <div key={user.id} className={`neo-card p-0 overflow-hidden flex flex-col h-full ${user.role === 'ADMIN' ? 'bg-white' : 'bg-white'}`}>
              {/* Header Card berbasis Role */}
              <div className={`p-4 flex justify-between items-center border-b-[4px] border-black ${user.role === 'ADMIN' ? 'bg-black text-white' : user.role === 'MANAGER' ? 'bg-[#5644FF] text-white' : 'bg-white text-black'}`}>
                <span className="font-black uppercase flex items-center gap-2">
                  <Shield size={18} /> {user.role}
                </span>
              </div>

              {/* Konten */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase mb-1">{user.name}</h3>
                  <p className="text-sm font-bold flex items-center gap-1 text-black/70 mb-4 uppercase">
                    <MapPin size={14} /> {user.branch === 'pusat' ? 'Semua Cabang (Pusat)' : `Cabang ${user.branch}`}
                  </p>
                </div>

                {/* Aksi & Ubah Role */}
                <div className="space-y-3 pt-4 border-t-[2px] border-black">
                  {user.role !== 'ADMIN' && (
                    <div className="flex gap-2">
                      <select
                        className="w-full text-xs font-bold border-[2px] border-black p-2 focus:outline-none uppercase bg-white rounded-xl cursor-pointer"
                        value={user.role}
                        onChange={(e) => {
                          const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, role: e.target.value as UserData['role'] } : u));
                          setUsers(updatedUsers);
                        }}
                      >
                        <option value="MANAGER">MANAGER</option>
                        <option value="KASIR">KASIR</option>
                        <option value="ADMIN">Jadikan ADMIN</option>
                      </select>
                    </div>
                  )}
                  <button
                    onClick={() => handleEditClick(user)}
                    className="w-full flex items-center justify-center gap-2 border-[2px] border-black py-2 font-black uppercase hover:bg-black hover:text-white transition-colors text-sm bg-white text-black rounded-xl"
                  >
                    <Edit size={14} /> EDIT {user.role === 'ADMIN' ? 'AKUN' : 'DETAIL'}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal Edit Pegawai */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-lg">
            <div className="bg-[#5644FF] text-white p-4 border-b-[4px] border-black flex justify-between items-center">
              <h2 className="font-black uppercase text-xl flex items-center gap-2">
                <Edit size={20} /> Edit Pegawai
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:scale-110 active:scale-95 transition-transform">
                <X size={24} className="stroke-[3px]" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block font-black uppercase text-sm mb-2">Nama Pegawai</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase text-sm mb-2">Role Akses</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all uppercase"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="KASIR">KASIR</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black uppercase text-sm mb-2">Cabang</label>
                  <select
                    value={editingUser.branch}
                    onChange={(e) => setEditingUser({ ...editingUser, branch: e.target.value })}
                    className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-[#FFC107] focus:shadow-[4px_4px_0px_0px_#000] transition-all uppercase"
                  >
                    <option value="pusat">Pusat</option>
                    <option value="depok">Depok</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-6 border-t-[3px] border-black border-dashed">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border-[3px] border-black font-black uppercase hover:bg-black hover:text-white transition-colors bg-white">
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#5644FF] text-white border-[3px] border-black font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_#000] hover:shadow-none transition-all flex justify-center items-center gap-2"
                >
                  <Save size={20} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
