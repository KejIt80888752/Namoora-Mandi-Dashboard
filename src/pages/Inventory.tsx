import { useState, useRef } from "react";
import { Plus, Upload, Search, Edit2, Check, X, Package } from "lucide-react";
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

  const startEdit = (p: Product) => { setEditId(p.id); setEditRow({ stock: p.stock, rate: p.rate, unit: p.unit }); };
  const saveEdit = (id: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...editRow } : p)));
    setEditId(null);
  };

  const addProduct = () => {
    if (!newProduct.name?.trim()) return;
    setProducts([...products, {
      id: `p${Date.now()}`,
      name: newProduct.name!,
      category: newProduct.category!,
      stock: newProduct.stock ?? 0,
      unit: (newProduct.unit as Product["unit"]) ?? "KG",
      rate: newProduct.rate ?? 0,
    }]);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-army-800 uppercase tracking-wider">Inventory</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            <span className="text-army-600 font-semibold">{inStockCount}</span> in stock · {products.length} total products
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-army-100 hover:bg-army-200 text-army-700 text-xs font-bold rounded-lg transition-colors border border-army-200">
            <Upload size={13} /> Upload Excel
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-army-700 hover:bg-army-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
            <Plus size={13} /> Add Product
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-white border border-army-100 rounded-xl px-3 py-2.5 shadow-sm">
          <Search size={14} className="text-army-400" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="text-xs border border-army-100 rounded-xl px-2.5 py-2 bg-white outline-none shadow-sm text-army-700 font-medium">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-army-800 mb-4 uppercase tracking-wider text-sm">Add New Product</h3>
            <div className="space-y-3">
              <input placeholder="Product name" value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-army-500" />
              <select value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-army-500">
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="number" placeholder="Stock" value={newProduct.stock || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseFloat(e.target.value) || 0 })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-army-500" />
                <select value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value as Product["unit"] })}
                  className="border border-gray-200 rounded-xl px-2.5 py-2.5 text-sm outline-none focus:border-army-500">
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <input type="number" placeholder="Rate (Rs.)" value={newProduct.rate || ""}
                onChange={(e) => setNewProduct({ ...newProduct, rate: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-army-500" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">Cancel</button>
              <button onClick={addProduct}
                className="flex-1 py-2.5 bg-army-700 rounded-xl text-sm text-white font-bold">Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-army-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-army-700 text-white text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-3 py-2.5 text-left font-bold">Product</th>
                <th className="px-3 py-2.5 text-center font-bold">Stock</th>
                <th className="px-3 py-2.5 text-center font-bold">Unit</th>
                <th className="px-3 py-2.5 text-center font-bold">Rate (Rs.)</th>
                <th className="px-3 py-2.5 text-center font-bold">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p, idx) => (
                <tr key={p.id} className={`hover:bg-army-50 transition-colors ${p.stock === 0 ? "opacity-50" : ""} ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-army-100 rounded flex items-center justify-center flex-shrink-0">
                        <Package size={11} className="text-army-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{p.name}</p>
                        <p className="text-gray-400 text-[10px]">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <input type="number" value={editRow.stock ?? ""}
                        onChange={(e) => setEditRow({ ...editRow, stock: parseFloat(e.target.value) || 0 })}
                        className="w-16 border border-army-400 rounded-lg px-1 py-1 text-xs text-center outline-none" />
                    ) : (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.stock === 0 ? "bg-red-100 text-red-500" : p.stock < 5 ? "bg-yellow-100 text-yellow-700" : "bg-army-100 text-army-700"
                      }`}>{p.stock}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <select value={editRow.unit ?? p.unit}
                        onChange={(e) => setEditRow({ ...editRow, unit: e.target.value as Product["unit"] })}
                        className="border border-army-400 rounded-lg px-1 py-1 text-xs outline-none">
                        {UNITS.map((u) => <option key={u}>{u}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">{p.unit}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <input type="number" value={editRow.rate ?? ""}
                        onChange={(e) => setEditRow({ ...editRow, rate: parseFloat(e.target.value) || 0 })}
                        className="w-16 border border-army-400 rounded-lg px-1 py-1 text-xs text-center outline-none" />
                    ) : (
                      <span className="text-xs text-gray-700 font-semibold">Rs.{p.rate}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {editId === p.id ? (
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => saveEdit(p.id)} className="p-1.5 bg-army-600 text-white rounded-lg">
                          <Check size={11} />
                        </button>
                        <button onClick={() => setEditId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg">
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(p)} className="p-1.5 text-gray-400 hover:text-army-700 hover:bg-army-100 rounded-lg transition-colors">
                        <Edit2 size={13} />
                      </button>
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
