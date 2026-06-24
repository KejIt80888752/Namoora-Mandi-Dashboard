import { useState } from "react";
import { Search, Send, Eye, X, Trash2, FileText, IndianRupee, MapPin, Phone, ShoppingBasket, Calendar, User } from "lucide-react";
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
    const line = "━".repeat(30);
    const billDateStr = new Date(bill.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const header = `*NAMOORA MANDI by KRISHNA KAVERI*\nNo 80/3, Mandi No. 1083\nOpp. Thippasandra Market, Bengaluru - 560075\nPh: +91 95138 03912\n${line}\n`;
    const info = `Bill No: *${bill.billNo}*   Date: *${billDateStr}*\nCustomer: *${bill.customerName}*\nMobile: *${bill.customerMobile ? `+91 ${bill.customerMobile}` : "-"}*\n${line}\n`;
    const rows = bill.items.map((item) => {
      const parts = [];
      if (item.kg > 0) parts.push(`${item.kg} KG`);
      if (item.sets > 0) parts.push(`${item.sets} Sets`);
      return `${item.name}\n  ${parts.join(" + ")} x Rs.${item.rate} = *Rs.${item.amount.toFixed(2)}*`;
    }).join("\n");
    const footer = `\n${line}\n*TOTAL: Rs.${bill.total.toFixed(2)}*\n${line}\nThank you for shopping with us!`;
    const text = header + info + rows + footer;
    const phone = bill.customerMobile.replace(/\D/g, "");
    window.open(
      phone.length >= 10
        ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const totalRevenue = bills.reduce((s, b) => s + b.total, 0);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-army-700 rounded-xl p-4 text-white shadow">
          <FileText size={18} className="mb-1.5 text-army-300" />
          <p className="text-2xl font-bold">{bills.length}</p>
          <p className="text-army-300 text-xs font-medium">Total Bills</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-army-100 shadow-sm">
          <IndianRupee size={18} className="mb-1.5 text-army-600" />
          <p className="text-2xl font-bold text-gray-800">&#8377;{totalRevenue.toLocaleString("en-IN")}</p>
          <p className="text-gray-400 text-xs font-medium">Total Revenue</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-army-100 rounded-xl px-3 py-2.5 mb-4 shadow-sm">
        <Search size={15} className="text-army-400" />
        <input type="text" placeholder="Search by bill no, customer name..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none" />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-army-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText size={28} className="text-army-400" />
          </div>
          <p className="text-gray-600 font-semibold">{bills.length === 0 ? "No bills yet" : "No results found"}</p>
          <p className="text-gray-400 text-sm mt-1">{bills.length === 0 ? "Create your first bill!" : "Try a different search"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((bill) => (
            <div key={bill.id} className="bg-white rounded-xl border border-army-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-4 py-3">
                <div className="w-10 h-10 bg-army-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                  <FileText size={17} className="text-army-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-army-700 bg-army-100 px-2 py-0.5 rounded-full">{bill.billNo}</span>
                    <span className="text-[10px] text-gray-400">{bill.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">{bill.customerName}</p>
                  <p className="text-xs text-gray-400">{bill.customerMobile ? `+91 ${bill.customerMobile}` : "No mobile"} · {bill.items.length} items</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-base font-bold text-army-700">&#8377;{bill.total.toLocaleString("en-IN")}</p>
                  <div className="flex gap-1.5 mt-1.5 justify-end">
                    <button onClick={() => setViewBill(bill)} className="p-1.5 bg-army-100 hover:bg-army-200 rounded-lg text-army-600 transition-colors">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => sendWhatsApp(bill)} className="p-1.5 bg-[#25D366] hover:bg-[#1ebe5d] rounded-lg text-white transition-colors">
                      <Send size={13} />
                    </button>
                    <button onClick={() => deleteBill(bill.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewBill && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Invoice Header */}
            <div className="bg-army-700 text-white p-4 flex-shrink-0 relative">
              <button onClick={() => setViewBill(null)}
                className="absolute top-3 right-3 p-1.5 bg-army-600 hover:bg-army-500 rounded-lg transition-colors">
                <X size={15} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-army-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBasket size={18} className="text-army-200" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-widest uppercase">Namoora Mandi</h2>
                  <p className="text-army-300 text-[10px]">by Krishna Kaveri</p>
                </div>
              </div>
              <div className="flex items-start gap-1 text-army-300 text-[10px] mb-0.5">
                <MapPin size={9} className="mt-0.5 flex-shrink-0" />
                <span>No 80/3, Mandi No. 1083, Opp. Thippasandra Market, Bengaluru - 560075</span>
              </div>
              <div className="flex items-center gap-1 text-army-300 text-[10px]">
                <Phone size={9} />
                <span>+91 95138 03912</span>
              </div>
            </div>

            {/* Bill Meta */}
            <div className="grid grid-cols-3 divide-x divide-army-100 bg-army-50 border-b border-army-100 flex-shrink-0 text-xs">
              <div className="px-3 py-2">
                <p className="text-[9px] text-gray-400 uppercase font-bold">Bill No</p>
                <p className="font-bold text-gray-800 text-xs mt-0.5">{viewBill.billNo}</p>
              </div>
              <div className="px-3 py-2">
                <p className="text-[9px] text-gray-400 uppercase font-bold flex items-center gap-0.5"><Calendar size={8} /> Date</p>
                <p className="font-bold text-gray-800 text-xs mt-0.5">{viewBill.date}</p>
              </div>
              <div className="px-3 py-2">
                <p className="text-[9px] text-gray-400 uppercase font-bold flex items-center gap-0.5"><User size={8} /> Customer</p>
                <p className="font-bold text-gray-800 text-xs mt-0.5 truncate">{viewBill.customerName}</p>
                {viewBill.customerMobile && <p className="text-[9px] text-gray-400">+91 {viewBill.customerMobile}</p>}
              </div>
            </div>

            {/* Items */}
            <div className="px-4 py-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-12 text-[9px] font-bold text-army-600 uppercase tracking-wider border-b-2 border-army-700 pb-1.5 mb-1">
                <div className="col-span-4">Items</div>
                <div className="col-span-2 text-center">K.G.</div>
                <div className="col-span-2 text-center">Sets</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amt</div>
              </div>
              {viewBill.items.map((item, i) => (
                <div key={i} className={`grid grid-cols-12 items-center py-1.5 text-xs ${i % 2 !== 0 ? "bg-army-50 rounded" : ""}`}>
                  <div className="col-span-4 text-gray-800 font-semibold text-[11px] leading-tight">{item.name}</div>
                  <div className="col-span-2 text-center text-gray-500">{item.kg || "—"}</div>
                  <div className="col-span-2 text-center text-gray-500">{item.sets || "—"}</div>
                  <div className="col-span-2 text-center text-gray-500">Rs.{item.rate}</div>
                  <div className="col-span-2 text-right font-bold text-gray-800">Rs.{item.amount.toFixed(0)}</div>
                </div>
              ))}
              <div className="mt-3 pt-2.5 border-t-2 border-army-700 flex justify-between items-center">
                <span className="text-sm font-bold text-army-800 uppercase tracking-wide">Total</span>
                <span className="text-xl font-bold text-army-700">Rs.{viewBill.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-4 py-2 bg-army-700 text-center flex-shrink-0">
              <p className="text-[10px] text-army-300">Thank you for shopping with us!</p>
            </div>

            <div className="px-4 pb-4 pt-3 flex-shrink-0">
              <button onClick={() => sendWhatsApp(viewBill)}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-xl text-sm font-bold shadow transition-all">
                <Send size={16} /> Send on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
