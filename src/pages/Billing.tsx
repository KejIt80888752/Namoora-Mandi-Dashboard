import { useState, useMemo, useRef } from "react";
import { Plus, Trash2, Send, Save, Search, X, CheckCircle, Printer } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import type { BillItem } from "../types";

export default function Billing() {
  const { products, bills, setBills, currentUser, nextBillNo } = useApp();
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [items, setItems] = useState<BillItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [savedBill, setSavedBill] = useState<{ billNo: string; total: number } | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const total = useMemo(() => items.reduce((s, i) => s + i.amount, 0), [items]);
  const billDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addItem = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || items.find((i) => i.productId === productId)) { setShowSearch(false); return; }
    setItems([...items, { productId, name: product.name, kg: 0, sets: 0, rate: product.rate, amount: 0 }]);
    setProductSearch("");
    setShowSearch(false);
  };

  const updateItem = (idx: number, field: "kg" | "sets" | "rate", value: number) => {
    const updated = items.map((item, i) => {
      if (i !== idx) return item;
      const next = { ...item, [field]: value };
      next.amount = (next.kg + next.sets) * next.rate;
      return next;
    });
    setItems(updated);
  };

  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const buildWhatsAppText = (billNo: string) => {
    const line = "─".repeat(38);
    const header = `🧺 *NAMOORA MANDI by KRISHNA KAVERI*\n📍 No 80/3, Mandi No. 1083\nSecond Cross, Opp. Thippasandra Market\nBengaluru - 560075\n📞 +91 95138 03912\n${line}\n`;
    const info = `📋 *Bill No:* ${billNo}  |  *Date:* ${billDate}\n👤 *Customer:* ${customerName || "Walk-in"}\n📱 *Mobile:* ${customerMobile ? `+91 ${customerMobile}` : "-"}\n${line}\n`;
    const headerRow = `*ITEMS*\n`;
    const rows = items.map((item) => {
      const parts = [];
      if (item.kg > 0) parts.push(`${item.kg} KG`);
      if (item.sets > 0) parts.push(`${item.sets} Sets`);
      return `▸ ${item.name}\n  ${parts.join(" + ")} × ₹${item.rate} = *₹${item.amount.toFixed(2)}*`;
    }).join("\n");
    const footer = `\n${line}\n💰 *TOTAL: ₹${total.toFixed(2)}*\n${line}\n_Thank you for shopping with us!_ 🙏`;
    return header + info + headerRow + rows + footer;
  };

  const saveBillData = () => {
    if (items.length === 0) return null;
    const billNo = nextBillNo();
    const newBill = {
      id: `b${Date.now()}`,
      billNo,
      date: new Date().toISOString().split("T")[0],
      customerName: customerName || "Walk-in",
      customerMobile,
      items,
      total,
      createdBy: currentUser?.name || "",
    };
    setBills([...bills, newBill]);
    setSavedBill({ billNo, total });
    return billNo;
  };

  const handleSave = () => {
    saveBillData();
  };

  const handleWhatsApp = () => {
    const billNo = savedBill ? savedBill.billNo : saveBillData();
    if (!billNo) return;
    const text = buildWhatsAppText(typeof billNo === "string" ? billNo : billNo);
    const phone = customerMobile.replace(/\D/g, "");
    const url = phone.length >= 10
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    if (invoiceRef.current) window.print();
  };

  const clearBill = () => {
    setCustomerName(""); setCustomerMobile(""); setItems([]); setSavedBill(null);
  };

  if (savedBill) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        {/* Success Banner */}
        <div className="bg-green-500 rounded-2xl p-5 text-white text-center mb-4 shadow">
          <CheckCircle size={40} className="mx-auto mb-2" />
          <h2 className="text-xl font-bold">Bill Saved!</h2>
          <p className="text-green-100 text-sm mt-1">{savedBill.billNo} · ₹{savedBill.total.toFixed(2)}</p>
        </div>

        {/* Invoice Preview */}
        <div ref={invoiceRef} className="bg-white rounded-2xl border border-green-100 shadow overflow-hidden print:shadow-none print:rounded-none">
          {/* Invoice Header */}
          <div className="bg-green-600 text-white p-5 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🧺</span>
            </div>
            <h1 className="text-lg font-bold tracking-widest">NAMOORA MANDI</h1>
            <p className="text-green-100 text-xs mt-0.5">by Krishna Kaveri</p>
            <p className="text-green-200 text-[11px] mt-1">No 80/3, Mandi No. 1083, Second Cross</p>
            <p className="text-green-200 text-[11px]">Opp. Thippasandra Market, Bengaluru - 560075</p>
            <p className="text-green-100 text-[11px] mt-0.5">📞 +91 95138 03912</p>
          </div>

          {/* Bill Info */}
          <div className="flex justify-between px-5 py-3 bg-green-50 border-b border-green-100 text-xs">
            <div>
              <p className="text-gray-400">Bill No</p>
              <p className="font-bold text-gray-800 text-sm">{savedBill.billNo}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Date</p>
              <p className="font-bold text-gray-800 text-sm">{billDate}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Customer</p>
              <p className="font-bold text-gray-800 text-sm">{customerName || "Walk-in"}</p>
              {customerMobile && <p className="text-gray-500 text-[11px]">+91 {customerMobile}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="px-4 py-3">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-dashed border-gray-200 pb-2 mb-1">
              <div className="col-span-4">Items</div>
              <div className="col-span-2 text-center">K.G.</div>
              <div className="col-span-2 text-center">No.Sets</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 items-center py-1.5 border-b border-gray-50 text-xs">
                <div className="col-span-4 text-gray-800 font-medium">{item.name}</div>
                <div className="col-span-2 text-center text-gray-600">{item.kg || "-"}</div>
                <div className="col-span-2 text-center text-gray-600">{item.sets || "-"}</div>
                <div className="col-span-2 text-center text-gray-600">₹{item.rate}</div>
                <div className="col-span-2 text-right font-semibold text-gray-800">₹{item.amount.toFixed(2)}</div>
              </div>
            ))}

            {/* Total */}
            <div className="mt-3 pt-2 border-t-2 border-green-500">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">TOTAL</span>
                <span className="text-xl font-bold text-green-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-green-50 border-t border-green-100 text-center">
            <p className="text-xs text-green-600 font-medium">Thank you for shopping with us! 🙏</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Fresh vegetables & fruits daily</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button onClick={handlePrint} className="flex items-center justify-center gap-1.5 py-3 bg-white border border-green-200 rounded-xl text-sm text-green-700 font-semibold hover:bg-green-50">
            <Printer size={16} /> Print
          </button>
          <button onClick={handleWhatsApp} className="flex items-center justify-center gap-1.5 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl text-sm font-bold shadow">
            <Send size={16} /> WhatsApp
          </button>
          <button onClick={clearBill} className="flex items-center justify-center gap-1.5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold shadow">
            <Plus size={16} /> New Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">New Bill</h2>
          <p className="text-xs text-gray-400">{billDate}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Details</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
          />
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-100">
            <span className="px-2.5 text-xs text-gray-500 font-medium border-r border-gray-200 py-2.5 bg-gray-50">+91</span>
            <input
              type="tel" placeholder="Mobile" inputMode="numeric" maxLength={10}
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ""))}
              className="flex-1 px-2.5 py-2.5 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden mb-3">
        {/* Header */}
        <div className="grid grid-cols-12 bg-green-600 text-white text-[11px] px-3 py-2.5 font-bold uppercase tracking-wide">
          <div className="col-span-4">Items</div>
          <div className="col-span-2 text-center">K.G.</div>
          <div className="col-span-2 text-center">No.Sets</div>
          <div className="col-span-2 text-center">Rate</div>
          <div className="col-span-2 text-center">Amount</div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus size={20} className="text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">Tap "Add Item" to start billing</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 items-center px-3 py-2 border-b border-gray-50 hover:bg-green-50 transition-colors">
              <div className="col-span-4 flex items-center gap-1.5">
                <button onClick={() => removeItem(idx)} className="text-red-300 hover:text-red-500 flex-shrink-0 transition-colors">
                  <X size={13} />
                </button>
                <span className="text-xs text-gray-800 font-medium leading-tight">{item.name}</span>
              </div>
              <div className="col-span-2 px-1">
                <input type="number" value={item.kg || ""} onChange={(e) => updateItem(idx, "kg", parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 focus:border-green-400 rounded-lg px-1.5 py-1 text-xs text-center outline-none" placeholder="0" />
              </div>
              <div className="col-span-2 px-1">
                <input type="number" value={item.sets || ""} onChange={(e) => updateItem(idx, "sets", parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 focus:border-green-400 rounded-lg px-1.5 py-1 text-xs text-center outline-none" placeholder="0" />
              </div>
              <div className="col-span-2 px-1">
                <input type="number" value={item.rate || ""} onChange={(e) => updateItem(idx, "rate", parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 focus:border-green-400 rounded-lg px-1.5 py-1 text-xs text-center outline-none" placeholder="0" />
              </div>
              <div className="col-span-2 text-center">
                <span className="text-xs font-bold text-green-600">₹{item.amount.toFixed(0)}</span>
              </div>
            </div>
          ))
        )}

        {/* Total Row */}
        {items.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 bg-green-50 border-t-2 border-green-500">
            <span className="text-sm font-bold text-gray-700">TOTAL AMOUNT</span>
            <span className="text-xl font-bold text-green-600">₹{total.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Add Item */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-green-300 rounded-xl text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors"
        >
          <Plus size={17} /> Add Item
        </button>

        {showSearch && (
          <div className="absolute top-full left-0 right-0 z-20 bg-white border border-green-200 rounded-xl shadow-xl mt-1 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 bg-green-50">
              <Search size={14} className="text-green-500" />
              <input autoFocus type="text" placeholder="Search product..." value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent" />
              <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filteredProducts.slice(0, 30).map((p) => (
                <button key={p.id} onClick={() => addItem(p.id)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 flex justify-between items-center border-b border-gray-50 transition-colors">
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{p.category}</span>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-5">No products found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleSave} disabled={items.length === 0}
          className="flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-all">
          <Save size={16} /> Save Bill
        </button>
        <button onClick={handleWhatsApp} disabled={items.length === 0}
          className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-all">
          <Send size={16} /> Save & WhatsApp
        </button>
      </div>
    </div>
  );
}
