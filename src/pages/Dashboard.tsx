import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Package, TrendingUp, AlertCircle, Plus, Eye,
  FileText, ChevronRight, IndianRupee, BarChart2, Layers, User
} from "lucide-react";
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
    return Object.entries(map);
  }, [products]);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">

      {/* Hero Banner */}
      <div className="bg-army-700 rounded-2xl p-5 text-white shadow-md overflow-hidden relative">
        <div className="absolute right-0 top-0 w-32 h-full bg-army-600 opacity-30 rounded-l-full" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className="text-army-300" />
              <p className="text-army-300 text-xs font-medium">{currentUser?.role}</p>
            </div>
            <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
            <p className="text-army-300 text-xs mt-1.5">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-army-300 text-xs">All Time Revenue</p>
            <p className="text-2xl font-bold mt-0.5">&#8377;{stats.totalSales.toLocaleString("en-IN")}</p>
            <p className="text-army-400 text-xs mt-0.5">{bills.length} bills total</p>
          </div>
        </div>
      </div>

      {/* Today Stats */}
      <div>
        <p className="text-xs font-bold text-army-700 uppercase tracking-widest mb-2">Today</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-army-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-army-100 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-army-700" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.todayBills}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Bills Created</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-army-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-army-100 rounded-lg flex items-center justify-center">
                <IndianRupee size={18} className="text-army-700" />
              </div>
              <span className="text-xl font-bold text-gray-800">&#8377;{stats.todaySales.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Sales Amount</p>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <p className="text-xs font-bold text-army-700 uppercase tracking-widest mb-2">Stock Status</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 border border-army-100 text-center shadow-sm">
            <div className="w-8 h-8 bg-army-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Package size={15} className="text-army-600" />
            </div>
            <p className="text-xl font-bold text-gray-800">{stats.inStock}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium">In Stock</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-yellow-100 text-center shadow-sm">
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <AlertCircle size={15} className="text-yellow-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">{stats.lowStock}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Low Stock</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-red-100 text-center shadow-sm">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={15} className="text-red-400" />
            </div>
            <p className="text-xl font-bold text-gray-800">{stats.outOfStock}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-bold text-army-700 uppercase tracking-widest mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/billing"
            className="flex items-center justify-center gap-2.5 bg-army-700 hover:bg-army-800 text-white font-bold py-4 rounded-xl transition-all shadow">
            <div className="w-7 h-7 bg-army-600 rounded-lg flex items-center justify-center">
              <Plus size={17} />
            </div>
            Create Bill
          </Link>
          <Link to="/inventory"
            className="flex items-center justify-center gap-2.5 bg-white hover:bg-army-50 text-army-800 font-bold py-4 rounded-xl border border-army-200 shadow-sm transition-all">
            <div className="w-7 h-7 bg-army-100 rounded-lg flex items-center justify-center">
              <Package size={17} className="text-army-700" />
            </div>
            Inventory
          </Link>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-army-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={15} className="text-army-600" />
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Products by Category</p>
        </div>
        <div className="space-y-3">
          {categories.map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-army-100 rounded flex items-center justify-center flex-shrink-0">
                <Layers size={12} className="text-army-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 font-semibold">{cat}</span>
                  <span className="text-army-600 font-bold">{count}</span>
                </div>
                <div className="w-full bg-army-100 rounded-full h-1.5">
                  <div
                    className="bg-army-600 h-1.5 rounded-full"
                    style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-xl shadow-sm border border-army-100">
        <div className="flex items-center justify-between px-4 py-3 border-b border-army-50">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-army-600" />
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Recent Bills</h3>
          </div>
          <Link to="/bills" className="text-xs text-army-600 font-semibold flex items-center gap-0.5 hover:text-army-800">
            <Eye size={12} />
            View All <ChevronRight size={12} />
          </Link>
        </div>
        {recentBills.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-army-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-army-400" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">No bills yet</p>
            <p className="text-gray-400 text-xs mt-1">Create your first bill to get started</p>
            <Link to="/billing"
              className="inline-flex items-center gap-1.5 mt-3 text-xs bg-army-700 text-white px-3 py-1.5 rounded-lg font-semibold">
              <Plus size={12} /> Create Bill
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-army-50">
            {recentBills.map((b) => (
              <div key={b.id} className="flex items-center px-4 py-3 hover:bg-army-50 transition-colors">
                <div className="w-8 h-8 bg-army-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <ShoppingCart size={14} className="text-army-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{b.customerName}</p>
                  <p className="text-xs text-gray-400">{b.billNo} · {b.date} · {b.items.length} items</p>
                </div>
                <p className="text-sm font-bold text-army-700 ml-2">&#8377;{b.total.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
