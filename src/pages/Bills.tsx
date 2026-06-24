import { useState } from "react";
import { Search, Send, Eye, X, Trash2, FileText, IndianRupee } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import type { Bill } from "../types";

export default function Bills() {
  const { bills, setBills } = useApp();
  const [search, setSearch] = useState("");
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  const filtered = bills
    .filter((b) =>
      b.billNo.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerMobile.includes(search)
    )
    .slice().reverse();

  const deleteBill = (id: string) => {
    if (confirm("Delete this bill?")) setBills(bills.filter((b) => b.id !== id));
  };

  const sendWhatsApp = (bill: Bill) => {
    const line = "─".repeat(38);
    const billDateStr = new Date(bill.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const header = `🧺 *NAMOORA MANDI by KRISHNA KAVERI*\n📍 No 80/3, Mandi No. 1083\nSecond Cross, Opp. Thippasandra Market\nBengaluru - 560075\n📞 +91 95138 03912\n${line}\n`;
    const info = `📋 *Bill No:* ${bill.billNo}  |  *Date:* ${billDateStr}\n👤 *Customer:* ${bill.customerName}\n📱 *Mobile:* ${bill.customerMobile ? `+91 ${bill.customerMobile}` : "-"}\n${line}\n`;
    const rows = bill.items.map((item) => {
      const parts = [];
      if (item.kg > 0) parts.push(`${item.kg} KG`);
      if (item.sets > 0) parts.push(`${item.sets} Sets`);
      return `▸ ${item.name}\n  ${parts.join(" + ")} × ₹${item.rate} = *₹${item.amount.toFixed(2)}*`;
    }).join("\n");
    const footer = `\n${line}\n💰 *TOTAL: ₹${bill.total.toFixed(2)}*\n${line}\n_Thank you for shopping with us!_ 🙏`;
    const text = header + info + rows + footer;
    const phone = bill.customerMobile.replace(/\D/g, "");
    const url = phone.length >= 10
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const totalRevenue = bills.reduce((s, b) => s + b.total, 0);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-500 rounded-xl p-4 text-white">
          <FileText size={20} className="mb-1.5 opacity-80" />
          <p className="text-2xl font-bold">{bills.length}</p>
          <p className="text-green-100 text-xs">Total Bills</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
          <IndianRupee size={20} className="mb-1.5 text-green-500" />
          <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString("en-IN")}</p>
          <p className="text-gray-400 text-xs">Total Revenue</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-3 py-2.5 mb-4 shadow-sm">
        <Search size={15} className="text-green-400" />
        <input type="text" placeholder="Search by bill no, customer name..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none" />
      </div>

      {/* Bill List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText size={28} className="text-green-400" />
          </div>
          <p className="text-gray-500 font-medium">{bills.length === 0 ? "No bills yet" : "No results found"}</p>
          <p className="text-gray-400 text-sm mt-1">{bills.length === 0 ? "Create your first bill!" : "Try a different search"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((bill) => (
            <div key={bill.id} className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-4 py-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                  <FileText size={18} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{bill.billNo}</span>
                    <span className="text-xs text-gray-400">{bill.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{bill.customerName}</p>
                  <p className="text-xs text-gray-400">{bill.customerMobile ? `+91 ${bill.customerMobile}` : "No mobile"} · {bill.items.length} items</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-base font-bold text-green-600">₹{bill.total.toLocaleString("en-IN")}</p>
                  <div className="flex gap-1.5 mt-1.5 justify-end">
                    <button onClick={() => setViewBill(bill)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors" title="View">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => sendWhatsApp(bill)} className="p-1.5 bg-[#25D366] hover:bg-[#1ebe5d] rounded-lg text-white transition-colors" title="WhatsApp">
                      <Send size={13} />
                    </button>
                    <button onClick={() => deleteBill(bill.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-400 transition-colors" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bill View Modal */}
      {viewBill && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Invoice Header */}
            <div className="bg-green-600 text-white p-5 text-center flex-shrink-0 relative">
              <button onClick={() => setViewBill(null)} className="absolute top-3 right-3 p-1.5 bg-green-500 hover:bg-green-400 rounded-full transition-colors">
                <X size={15} />
              </button>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🧺</span>
              </div>
              <h2 className="text-base font-bold tracking-widest">NAMOORA MANDI</h2>
              <p className="text-green-100 text-[11px] mt-0.5">by Krishna Kaveri</p>
              <p className="text-green-200 text-[10px] mt-1">No 80/3, Mandi No. 1083, Bengaluru - 560075</p>
              <p className="text-green-100 text-[10px]">📞 +91 95138 03912</p>
            </div>

            {/* Bill Info Bar */}
            <div className="flex justify-between px-5 py-2.5 bg-green-50 border-b border-green-100 text-xs flex-shrink-0">
              <div>
                <p className="text-gray-400">Bill No</p>
                <p className="font-bold text-gray-800">{viewBill.billNo}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">Date</p>
                <p className="font-bold text-gray-800">{viewBill.date}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Customer</p>
                <p className="font-bold text-gray-800">{viewBill.customerName}</p>
                {viewBill.customerMobile && <p className="text-gray-500 text-[10px]">+91 {viewBill.customerMobile}</p>}
              </div>
            </div>

            {/* Items */}
            <div className="px-4 py-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-12 text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-dashed border-gray-200 pb-1.5 mb-1">
                <div className="col-span-4">Items</div>
                <div className="col-span-2 text-center">K.G.</div>
                <div className="col-span-2 text-center">Sets</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amt</div>
              </div>
              {viewBill.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center py-1.5 border-b border-gray-50 text-xs">
                  <div className="col-span-4 text-gray-800 font-medium text-[11px] leading-tight">{item.name}</div>
                  <div className="col-span-2 text-center text-gray-500">{item.kg || "-"}</div>
                  <div className="col-span-2 text-center text-gray-500">{item.sets || "-"}</div>
                  <div className="col-span-2 text-center text-gray-500">₹{item.rate}</div>
                  <div className="col-span-2 text-right font-bold text-gray-800">₹{item.amount.toFixed(0)}</div>
                </div>
              ))}
              <div className="mt-3 pt-2 border-t-2 border-green-500 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">TOTAL</span>
                <span className="text-xl font-bold text-green-600">₹{viewBill.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer Note */}
            <div className="px-5 py-2 bg-green-50 border-t border-green-100 text-center flex-shrink-0">
              <p className="text-[11px] text-green-600 font-medium">Thank you for shopping with us! 🙏</p>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 pt-2 flex gap-2 flex-shrink-0">
              <button onClick={() => sendWhatsApp(viewBill)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-xl text-sm font-bold shadow transition-all">
                <Send size={16} /> Send WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
