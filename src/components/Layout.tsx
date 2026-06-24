import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, FileText, Users, LogOut, ClipboardList, ShoppingBasket } from "lucide-react";
import { useApp } from "../contexts/AppContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/billing", label: "New Bill", icon: FileText },
  { path: "/bills", label: "Bills", icon: ClipboardList },
  { path: "/users", label: "Users", icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { currentUser, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const logout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-army-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-army-700 text-white px-4 py-3 flex items-center justify-between shadow sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-army-600 border border-army-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <ShoppingBasket size={19} className="text-army-100" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight tracking-widest uppercase">Namoora Mandi</h1>
            <p className="text-[11px] text-army-300 leading-tight">by Krishna Kaveri</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-white">{currentUser?.name}</span>
            <span className="text-[10px] text-army-300 capitalize">{currentUser?.role}</span>
          </div>
          <button onClick={logout} className="p-1.5 hover:bg-army-600 rounded-lg transition-colors" title="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-army-800 text-white">
          <nav className="flex-1 py-3">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === path
                    ? "bg-army-600 text-white shadow"
                    : "text-army-300 hover:bg-army-700 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-army-700">
            <p className="text-[10px] text-army-400 font-semibold uppercase tracking-wider mb-1">Namoora Mandi</p>
            <p className="text-[10px] text-army-500">No 80/3, Mandi No. 1083</p>
            <p className="text-[10px] text-army-500">Opp. Thippasandra Market</p>
            <p className="text-[10px] text-army-500">Bengaluru - 560075</p>
            <p className="text-[10px] text-army-400 mt-1 font-medium">+91 95138 03912</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-4">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-army-800 flex z-30">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 relative transition-colors ${
              pathname === path ? "text-army-200" : "text-army-500 hover:text-army-300"
            }`}
          >
            {pathname === path && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-army-400 rounded-full" />
            )}
            <Icon size={20} strokeWidth={pathname === path ? 2.5 : 1.8} />
            <span className="mt-0.5 text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
