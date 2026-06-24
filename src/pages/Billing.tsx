import { useState, useMemo, useRef } from "react";
import { Plus, Trash2, Send, Save, Search, X, CheckCircle, Printer, ShoppingBasket, MapPin, Phone, User, Calendar } from "lucide-react";
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
    setProductSearch(""); setShowSearch(false);
  };

  const updateItem = (idx: number, field: "kg" | "sets" | "rate", value: number) => {
    setItems(items.map((item, i) => {
      if (i !== idx) return item;
      const next = { ...item, [field]: value };
      next.amount = (next.kg + next.sets) * next.rate;
      return next;
    }));
  };

  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const buildWhatsAppText = (billNo: string) => {
    const line = "━".repeat(30);
    const header = `*NAMOORA MANDI by KRISHNA KAVERI*\nNo 80/3, Mandi No. 1083\nOpp. Thippasandra Market, Bengaluru - 560075\nPh: +91 95138 03912\n${line}\n`;
    const info = `Bill No: *${billNo}*   Date: *${billDate}*\nCustomer: *${customerName || "Walk-in"}*\nMobile: *${customerMobile ? `+91 ${customerMobile}` : "-"}*\n${line}\n`;
    const rows = items.map((item) => {
      const parts = [];
      if (item.kg > 0) parts.push(`${item.kg} KG`);
      if (item.sets > 0) parts.push(`${item.sets} Sets`);
      return `${item.name}\n  ${parts.join(" + ")} x Rs.${item.rate} = *Rs.${item.amount.toFixed(2)}*`;
    }).join("\n");
    const footer = `\n${line}\n*TOTAL: Rs.${total.toFixed(2)}*\n${line}\nThank you for shopping with us!`;
    return header + info + rows + footer;
  };

  const saveBillData = (): string | null => {
    if (items.length === 0) return null;
    const billNo = nextBillNo();
    setBills([...bills, {
      id: `b${Date.now()}`,
      billNo,
      date: new Date().toISOString().split("T")[0],
      customerName: customerName || "Walk-in",
      customerMobile,
      items,
      total,
      createdBy: currentUser?.name || "",
    }]);
    setSavedBill({ billNo, total });
    return billNo;
  };

  const handleSave = () => { saveBillData(); };

  const handleWhatsApp = () => {
    const billNo = savedBill?.billNo ?? saveBillData();
    if (!billNo) return;
    const text = buildWhatsAppText(billNo);
    const phone = customerMobile.replace(/\D/g, "");
    window.open(
      phone.length >= 10
        ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const clearBill = () => {
    setCustomerName(""); setCustomerMobile(""); setItems([]); setSavedBill(null);
  };

  /* ── Saved Invoice View ─────────────────────────────────────────── */
  if (savedBill) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-army-700 rounded-2xl p-4 text-white text-center mb-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-army-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={22} className="text-army-200" />
          </div>
          <div className="text-left">
            <p className="font-bold text-base">Bill Saved Successfully</p>
            <p className="text-army-300 text-xs">{savedBill.billNo} · Rs.{savedBill.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Invoice */}
        <div ref={invoiceRef} className="bg-white rounded-2xl border border-army-200 shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-army-700 text-white p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-army-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBasket size={20} className="text-army-200" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-widest uppercase">Namoora Mandi</h1>
                <p className="text-army-300 text-[11px]">by Krishna Kaveri</p>
              </div>
            </div>
            <div className="flex items-start gap-1 text-army-300 text-[10px] mb-0.5">
              <MapPin size={10} className="mt-0.5 flex-shrink-0" />
              <span>No 80/3, Mandi No. 1083, Second Cross, Opp. Thippasandra Market, Bengaluru - 560075</span>
            </div>
            <div className="flex items-center gap-1 text-army-300 text-[10px]">
              <Phone size={10} />
              <span>+91 95138 03912</span>
            </div>
          </div>

          {/* Bill Meta */}
          <div className="grid grid-cols-3 divide-x divide-army-100 bg-army-50 border-b border-army-100 text-xs">
            <div className="px-3 py-2.5">
              <p className="text-gray-400 text-[10px] font-medium uppercase">Bill No</p>
              <p className="font-bold text-gray-800 mt-0.5">{savedBill.billNo}</p>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-gray-400 text-[10px] font-medium uppercase flex items-center gap-1"><Calendar size={9} /> Date</p>
              <p className="font-bold text-gray-800 mt-0.5">{billDate}</p>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-gray-400 text-[10px] font-medium uppercase flex items-center gap-1"><User size={9} /> Customer</p>
              <p className="font-bold text-gray-800 mt-0.5 truncate">{customerName || "Walk-in"}</p>
              {customerMobile && <p className="text-gray-400 text-[10px]">+91 {customerMobile}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="px-4 py-3">
            <div className="grid grid-cols-12 text-[9px] font-bold text-army-600 uppercase tracking-wider border-b-2 border-army-700 pb-1.5 mb-1">
              <div className="col-span-4">Items</div>
              <div className="col-span-2 text-center">K.G.</div>
              <div className="col-span-2 text-center">No.Sets</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            {items.map((item, i) => (
              <div key={i} className={`grid grid-cols-12 items-center py-1.5 text-xs ${i % 2 === 0 ? "" : "bg-army-50 rounded"}`}>
                <div className="col-span-4 text-gray-800 font-semibold leading-tight">{item.name}</div>
                <div className="col-span-2 text-center text-gray-500">{item.kg || "—"}</div>
                <div className="col-span-2 text-center text-gray-500">{item.sets || "—"}</div>
                <div className="col-span-2 text-center text-gray-500">Rs.{item.rate}</div>
                <div className="col-span-2 text-right font-bold text-gray-800">Rs.{item.amount.toFixed(2)}</div>
              </div>
            ))}
            {/* Total */}
            <div className="mt-3 pt-2.5 border-t-2 border-army-700 flex justify-between items-center">
              <span className="text-sm font-bold text-army-800 uppercase tracking-wide">Total Amount</span>
              <span className="text-2xl font-bold text-army-700">Rs.{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-army-700 text-center">
            <p className="text-xs text-army-200 font-medium">Thank you for shopping with us!</p>
            <p className="text-[10px] text-army-400 mt-0.5">Fresh vegetables &amp; fruits daily · Bengaluru</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 py-3 bg-white border border-army-200 rounded-xl text-sm text-army-700 font-bold hover:bg-army-50 transition-colors">
            <Printer size={15} /> Print
          </button>
          <button onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl text-sm font-bold shadow transition-all">
            <Send size={15} /> WhatsApp
          </button>
          <button onClick={clearBill}
            className="flex items-center justify-center gap-1.5 py-3 bg-army-700 hover:bg-army-800 text-white rounded-xl text-sm font-bold shadow transition-all">
            <Plus size={15} /> New Bill
          </button>
        </div>
      </div>
    );
  }

  /* ── New Bill Form ──────────────────────────────────────────────── */
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-army-800 uppercase tracking-wider">New Bill</h2>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Calendar size={11} /> {billDate}
        </p>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-xl border border-army-100 shadow-sm p-4 mb-4">
        <p className="text-[10px] font-bold text-army-600 uppercase tracking-widest mb-3">Customer Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-army-400" />
            <input placeholder="Customer Name" value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none focus:border-army-500 focus:ring-1 focus:ring-army-100" />
          </div>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-army-500 focus-within:ring-1 focus-within:ring-army-100">
            <div className="flex items-center gap-1 px-2.5 bg-army-50 border-r border-gray-200 py-2.5">
              <Phone size={13} className="text-army-600" />
              <span className="text-xs text-army-700 font-bold">+91</span>
            </div>
            <input type="tel" placeholder="Mobile" inputMode="numeric" maxLength={10}
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ""))}
              className="flex-1 px-2.5 py-2.5 text-sm outline-none" />
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-army-100 shadow-sm overflow-hidden mb-3">
        <div className="grid grid-cols-12 bg-army-700 text-white text-[10px] px-3 py-2.5 font-bold uppercase tracking-widest">
          <div className="col-span-4">Items</div>
          <div className="col-span-2 text-center">K.G.</div>
          <div className="col-span-2 text-center">No.Sets</div>
          <div className="col-span-2 text-center">Rate</div>
          <div className="col-span-2 text-center">Amount</div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-army-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Plus size={20} className="text-army-400" />
            </div>
            <p className="text-gray-400 text-sm">Tap "Add Item" to begin</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 items-center px-3 py-2 border-b border-gray-50 hover:bg-army-50 transition-colors">
              <div className="col-span-4 flex items-center gap-1.5">
                <button onClick={() => removeItem(idx)} className="text-red-300 hover:text-red-500 flex-shrink-0">
                  <X size={13} />
                </button>
                <span className="text-xs text-gray-800 font-semibold leading-tight">{item.name}</span>
              </div>
              {(["kg", "sets", "rate"] as const).map((field) => (
                <div key={field} className="col-span-2 px-1">
                  <input type="number" value={item[field] || ""}
                    onChange={(e) => updateItem(idx, field, parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-200 focus:border-army-500 rounded-lg px-1.5 py-1 text-xs text-center outline-none" placeholder="0" />
                </div>
              ))}
              <div className="col-span-2 text-center">
                <span className="text-xs font-bold text-army-700">Rs.{item.amount.toFixed(0)}</span>
              </div>
            </div>
          ))
        )}

        {items.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 bg-army-50 border-t-2 border-army-700">
            <span className="text-sm font-bold text-army-800 uppercase tracking-wide">Total</span>
            <span className="text-xl font-bold text-army-700">Rs.{total.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Add Item */}
      <div className="relative mb-4">
        <button onClick={() => setShowSearch(!showSearch)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-army-300 rounded-xl text-army-600 text-sm font-bold hover:bg-army-50 transition-colors">
          <Plus size={17} /> Add Item
        </button>
        {showSearch && (
          <div className="absolute top-full left-0 right-0 z-20 bg-white border border-army-200 rounded-xl shadow-xl mt-1 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 bg-army-50">
              <Search size={14} className="text-army-500" />
              <input autoFocus type="text" placeholder="Search product..."
                value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent" />
              <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filteredProducts.slice(0, 30).map((p) => (
                <button key={p.id} onClick={() => addItem(p.id)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-army-50 flex justify-between items-center border-b border-gray-50">
                  <span className="font-semibold text-gray-800">{p.name}</span>
                  <span className="text-xs text-army-600 bg-army-100 px-2 py-0.5 rounded-full">{p.category}</span>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-5">No products found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save / WhatsApp */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleSave} disabled={items.length === 0}
          className="flex items-center justify-center gap-2 py-3.5 bg-army-700 hover:bg-army-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow transition-all">
          <Save size={16} /> Save Bill
        </button>
        <button onClick={handleWhatsApp} disabled={items.length === 0}
          className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow transition-all">
          <Send size={16} /> Save &amp; WhatsApp
        </button>
      </div>
    </div>
  );
}
