import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, TrendingUp, AlertCircle, Plus, Eye, FileText, ChevronRight, IndianRupee } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export default function Dashboard() {
  const { bills, products, currentUser } = useApp();

  const today = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    const todayBills = bills.filter((b) => b.date === today);
    const todaySales = todayBills.reduce((s, b) => s + b.total, 0);
    const totalSales = bills.reduce((s, b) => s + b.total, 0);
    const inStock = products.filter((p) => p.stock > 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    return { todayBills: todayBills.length, todaySales, totalSales, inStock, lowStock, outOfStock, totalProducts: products.length };
  }, [bills, products, today]);

  const recentBills = bills.slice(-5).reverse();
  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [products]);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-green-100 text-sm">Good day,</p>
            <h2 className="text-2xl font-bold mt-0.5">{currentUser?.name} 👋</h2>
            <p className="text-green-100 text-xs mt-1.5">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-100 text-xs">All Time Revenue</p>
            <p className="text-2xl font-bold mt-0.5">₹{stats.totalSales.toLocaleString("en-IN")}</p>
            <p className="text-green-200 text-xs">{bills.length} bills</p>
          </div>
        </div>
      </div>

      {/* Today Stats */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Today's Summary</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.todayBills}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Bills Today</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                <IndianRupee size={18} className="text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">₹{stats.todaySales.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Sales Today</p>
          </div>
        </div>
      </div>

      {/* Stock Stats */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Stock Status</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 border border-green-100 text-center shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Package size={16} className="text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-800">{stats.inStock}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">In Stock</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-yellow-100 text-center shadow-sm">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <AlertCircle size={16} className="text-yellow-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">{stats.lowStock}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Low Stock</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-red-100 text-center shadow-sm">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={16} className="text-red-400" />
            </div>
            <p className="text-xl font-bold text-gray-800">{stats.outOfStock}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/billing"
            className="flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus size={18} />
            </div>
            Create Bill
          </Link>
          <Link
            to="/inventory"
            className="flex items-center justify-center gap-2.5 bg-white hover:bg-green-50 text-green-700 font-bold py-4 rounded-xl transition-all border border-green-200 shadow-sm"
          >
            <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-green-600" />
            </div>
            Inventory
          </Link>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Products by Category</p>
        <div className="space-y-2">
          {Object.entries(categories).map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium">{cat}</span>
                  <span className="text-gray-400">{count} items</span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100">
        <div className="flex items-center justify-between px-4 py-3 border-b border-green-50">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-green-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Recent Bills</h3>
          </div>
          <Link to="/bills" className="text-xs text-green-600 font-medium flex items-center gap-0.5 hover:text-green-700">
            View All <ChevronRight size={13} />
          </Link>
        </div>
        {recentBills.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-green-400" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No bills yet</p>
            <p className="text-gray-400 text-xs mt-1">Create your first bill to get started</p>
            <Link to="/billing" className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 font-semibold">
              <Plus size={13} /> Create Bill
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-green-50">
            {recentBills.map((b) => (
              <div key={b.id} className="flex items-center px-4 py-3 hover:bg-green-50 transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <ShoppingCart size={15} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{b.customerName}</p>
                  <p className="text-xs text-gray-400">{b.billNo} · {b.date} · {b.items.length} items</p>
                </div>
                <p className="text-sm font-bold text-green-600 ml-2">₹{b.total.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
