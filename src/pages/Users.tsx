import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, ShieldCheck, User as UserIcon } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import type { User } from "../types";

export default function Users() {
  const { users, setUsers, currentUser } = useApp();
  const [editId, setEditId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<User>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ name: "", mobile: "", role: "staff" });

  const startEdit = (u: User) => { setEditId(u.id); setEditRow({ name: u.name, mobile: u.mobile, role: u.role }); };
  const saveEdit = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...editRow } : u)));
    setEditId(null);
  };
  const deleteUser = (id: string) => {
    if (id === currentUser?.id) return alert("Cannot delete your own account");
    if (confirm("Delete this user?")) setUsers(users.filter((u) => u.id !== id));
  };
  const addUser = () => {
    if (!newUser.name?.trim() || !newUser.mobile?.trim() || newUser.mobile.length !== 10) return;
    setUsers([...users, { id: `u${Date.now()}`, name: newUser.name!, mobile: newUser.mobile!, role: newUser.role ?? "staff" }]);
    setShowAdd(false);
    setNewUser({ name: "", mobile: "", role: "staff" });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Users</h2>
          <p className="text-xs text-gray-500">{users.length} users registered</p>
        </div>
        {currentUser?.role === "admin" && (
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-medium rounded-lg">
            <Plus size={14} /> Add User
          </button>
        )}
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-gray-800 mb-4">Add New User</h3>
            <div className="space-y-3">
              <input placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-green-500">
                <span className="px-2 text-xs text-gray-500 border-r border-gray-200 py-2">+91</span>
                <input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={newUser.mobile} onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value.replace(/\D/g, "") })} className="flex-1 px-2 py-2 text-sm outline-none" />
              </div>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500">
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={addUser} className="flex-1 py-2 bg-green-700 rounded-lg text-sm text-white font-medium">Add User</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className={`bg-white rounded-xl border shadow-sm p-4 ${u.id === currentUser?.id ? "border-green-200" : "border-gray-100"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${u.role === "admin" ? "bg-green-100" : "bg-gray-100"}`}>
                {u.role === "admin" ? <ShieldCheck size={20} className="text-green-700" /> : <UserIcon size={20} className="text-gray-500" />}
              </div>
              <div className="flex-1">
                {editId === u.id ? (
                  <div className="space-y-1.5">
                    <input value={editRow.name ?? ""} onChange={(e) => setEditRow({ ...editRow, name: e.target.value })} className="w-full border border-green-300 rounded px-2 py-1 text-sm outline-none" placeholder="Name" />
                    <input value={editRow.mobile ?? ""} onChange={(e) => setEditRow({ ...editRow, mobile: e.target.value.replace(/\D/g, "") })} className="w-full border border-green-300 rounded px-2 py-1 text-sm outline-none" placeholder="Mobile" maxLength={10} />
                    <select value={editRow.role ?? "staff"} onChange={(e) => setEditRow({ ...editRow, role: e.target.value as User["role"] })} className="border border-green-300 rounded px-2 py-1 text-sm outline-none">
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                      {u.id === currentUser?.id && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">You</span>}
                    </div>
                    <p className="text-xs text-gray-500">+91 {u.mobile}</p>
                    <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${u.role === "admin" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.role}
                    </span>
                  </>
                )}
              </div>
              {currentUser?.role === "admin" && (
                <div className="flex gap-1.5">
                  {editId === u.id ? (
                    <>
                      <button onClick={() => saveEdit(u.id)} className="p-1.5 bg-green-600 text-white rounded-lg"><Check size={14} /></button>
                      <button onClick={() => setEditId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg"><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(u)} className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg"><Edit2 size={15} /></button>
                      {u.id !== currentUser?.id && (
                        <button onClick={() => deleteUser(u.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
        <p className="text-xs text-green-700 font-medium mb-1">Login Instructions</p>
        <p className="text-xs text-green-600">Users login with their registered mobile number. Only admin can add/edit users.</p>
      </div>
    </div>
  );
}
