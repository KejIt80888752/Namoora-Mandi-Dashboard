import { useState, useRef } from "react";
import { Plus, Upload, Search, Edit2, Check, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useApp } from "../contexts/AppContext";
import type { Product } from "../types";

const CATEGORIES = ["All", "Vegetables", "Leaves & Greens", "Exotic Vegetables", "Fruits"];
const UNITS = ["KG", "Set", "Piece", "Bundle"] as const;

export default function Inventory() {
  const { products, setProducts } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editId, setEditId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<Product>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: "", category: "Vegetables", stock: 0, unit: "KG", rate: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setEditRow({ stock: p.stock, rate: p.rate, unit: p.unit });
  };

  const saveEdit = (id: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...editRow } : p)));
    setEditId(null);
  };

  const addProduct = () => {
    if (!newProduct.name?.trim()) return;
    const id = `p${Date.now()}`;
    setProducts([...products, { id, name: newProduct.name!, category: newProduct.category!, stock: newProduct.stock ?? 0, unit: (newProduct.unit as Product["unit"]) ?? "KG", rate: newProduct.rate ?? 0 }]);
    setShowAdd(false);
    setNewProduct({ name: "", category: "Vegetables", stock: 0, unit: "KG", rate: 0 });
  };

  const handleExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws);
      const updated = [...products];
      rows.forEach((row) => {
        const name = String(row["ITEMS"] || row["Name"] || row["PRODUCT"] || "").trim();
        const rate = parseFloat(String(row["RATE"] || row["Rate"] || "0")) || 0;
        const stock = parseFloat(String(row["K.G."] || row["KG"] || row["Stock"] || "0")) || 0;
        if (!name) return;
        const idx = updated.findIndex((p) => p.name.toLowerCase() === name.toLowerCase());
        if (idx >= 0) {
          if (rate > 0) updated[idx] = { ...updated[idx], rate };
          if (stock > 0) updated[idx] = { ...updated[idx], stock };
        } else {
          updated.push({ id: `p${Date.now()}_${Math.random()}`, name, category: "Vegetables", stock, unit: "KG", rate });
        }
      });
      setProducts(updated);
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const inStockCount = products.filter((p) => p.stock > 0).length;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Inventory</h2>
          <p className="text-xs text-gray-500">{inStockCount}/{products.length} items in stock</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
            <Upload size={14} /> Upload Excel
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-medium rounded-lg transition-colors">
            <Plus size={14} /> Add Product
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <Search size={15} className="text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-2 bg-white outline-none">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-gray-800 mb-4">Add New Product</h3>
            <div className="space-y-3">
              <input placeholder="Product name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500">
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="number" placeholder="Stock" value={newProduct.stock || ""} onChange={(e) => setNewProduct({ ...newProduct, stock: parseFloat(e.target.value) || 0 })} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
                <select value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value as Product["unit"] })} className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-green-500">
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <input type="number" placeholder="Rate (₹)" value={newProduct.rate || ""} onChange={(e) => setNewProduct({ ...newProduct, rate: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={addProduct} className="flex-1 py-2 bg-green-700 rounded-lg text-sm text-white font-medium">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-800 text-white text-xs">
              <tr>
                <th className="px-3 py-2.5 text-left font-medium">Product</th>
                <th className="px-3 py-2.5 text-center font-medium">Stock</th>
                <th className="px-3 py-2.5 text-center font-medium">Unit</th>
                <th className="px-3 py-2.5 text-center font-medium">Rate (₹)</th>
                <th className="px-3 py-2.5 text-center font-medium">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className={`hover:bg-gray-50 ${p.stock === 0 ? "opacity-60" : ""}`}>
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-gray-800 text-xs">{p.name}</p>
                    <p className="text-gray-400 text-[10px]">{p.category}</p>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <input type="number" value={editRow.stock ?? ""} onChange={(e) => setEditRow({ ...editRow, stock: parseFloat(e.target.value) || 0 })} className="w-16 border border-green-400 rounded px-1 py-0.5 text-xs text-center outline-none" />
                    ) : (
                      <span className={`text-xs font-medium ${p.stock === 0 ? "text-red-400" : p.stock < 5 ? "text-yellow-600" : "text-green-700"}`}>{p.stock}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <select value={editRow.unit ?? p.unit} onChange={(e) => setEditRow({ ...editRow, unit: e.target.value as Product["unit"] })} className="border border-green-400 rounded px-1 py-0.5 text-xs outline-none">
                        {UNITS.map((u) => <option key={u}>{u}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-600">{p.unit}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <input type="number" value={editRow.rate ?? ""} onChange={(e) => setEditRow({ ...editRow, rate: parseFloat(e.target.value) || 0 })} className="w-16 border border-green-400 rounded px-1 py-0.5 text-xs text-center outline-none" />
                    ) : (
                      <span className="text-xs text-gray-700">₹{p.rate}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => saveEdit(p.id)} className="p-1 bg-green-600 text-white rounded"><Check size={12} /></button>
                        <button onClick={() => setEditId(null)} className="p-1 bg-gray-300 text-gray-600 rounded"><X size={12} /></button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(p)} className="p-1 text-gray-400 hover:text-green-700"><Edit2 size={14} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
