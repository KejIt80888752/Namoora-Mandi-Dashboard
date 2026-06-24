import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, ShieldCheck, User as UserIcon, Phone, Info } from "lucide-react";
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
          <h2 className="text-lg font-bold text-army-800 uppercase tracking-wider">Users</h2>
          <p className="text-xs text-gray-400 mt-0.5">{users.length} registered users</p>
        </div>
        {currentUser?.role === "admin" && (
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-army-700 hover:bg-army-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
            <Plus size={13} /> Add User
          </button>
        )}
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-army-800 mb-4 uppercase tracking-wider text-sm">Add New User</h3>
            <div className="space-y-3">
              <div className="relative">
                <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-army-400" />
                <input placeholder="Full Name" value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none focus:border-army-500" />
              </div>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-army-500">
                <div className="flex items-center gap-1 px-2.5 bg-army-50 border-r border-gray-200 py-2.5">
                  <Phone size={13} className="text-army-600" />
                  <span className="text-xs text-army-700 font-bold">+91</span>
                </div>
                <input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value.replace(/\D/g, "") })}
                  className="flex-1 px-2.5 py-2.5 text-sm outline-none" />
              </div>
              <select value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-army-500">
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">Cancel</button>
              <button onClick={addUser}
                className="flex-1 py-2.5 bg-army-700 rounded-xl text-sm text-white font-bold">Add User</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className={`bg-white rounded-xl border shadow-sm p-4 transition-colors ${u.id === currentUser?.id ? "border-army-400" : "border-army-100"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${u.role === "admin" ? "bg-army-700" : "bg-army-100"}`}>
                {u.role === "admin"
                  ? <ShieldCheck size={20} className="text-army-200" />
                  : <UserIcon size={20} className="text-army-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                {editId === u.id ? (
                  <div className="space-y-1.5">
                    <input value={editRow.name ?? ""} onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
                      className="w-full border border-army-300 rounded-lg px-2.5 py-1.5 text-sm outline-none" placeholder="Name" />
                    <input value={editRow.mobile ?? ""} onChange={(e) => setEditRow({ ...editRow, mobile: e.target.value.replace(/\D/g, "") })}
                      className="w-full border border-army-300 rounded-lg px-2.5 py-1.5 text-sm outline-none" placeholder="Mobile" maxLength={10} />
                    <select value={editRow.role ?? "staff"} onChange={(e) => setEditRow({ ...editRow, role: e.target.value as User["role"] })}
                      className="border border-army-300 rounded-lg px-2.5 py-1.5 text-sm outline-none">
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800">{u.name}</p>
                      {u.id === currentUser?.id && (
                        <span className="text-[10px] bg-army-700 text-white px-1.5 py-0.5 rounded-full font-bold">You</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone size={10} className="text-gray-400" />
                      <p className="text-xs text-gray-500">+91 {u.mobile}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                      u.role === "admin" ? "bg-army-100 text-army-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {u.role === "admin" ? <ShieldCheck size={9} /> : <UserIcon size={9} />}
                      {u.role}
                    </span>
                  </>
                )}
              </div>
              {currentUser?.role === "admin" && (
                <div className="flex gap-1.5 flex-shrink-0">
                  {editId === u.id ? (
                    <>
                      <button onClick={() => saveEdit(u.id)} className="p-1.5 bg-army-600 text-white rounded-lg">
                        <Check size={13} />
                      </button>
                      <button onClick={() => setEditId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg">
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(u)} className="p-1.5 text-gray-400 hover:text-army-700 hover:bg-army-100 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button onClick={() => deleteUser(u.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-army-100 rounded-xl border border-army-200">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-army-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-army-700 font-bold mb-0.5">Login Instructions</p>
            <p className="text-xs text-army-600">Users log in using their registered mobile number. Only admin can add or edit users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
