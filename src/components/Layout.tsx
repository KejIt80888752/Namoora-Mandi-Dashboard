import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, FileText, Users, LogOut, ClipboardList } from "lucide-react";
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
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-xl">🧺</span>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight tracking-wide">NAMOORA MANDI</h1>
            <p className="text-[11px] text-green-100 leading-tight">by Krishna Kaveri</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-white">{currentUser?.name}</span>
            <span className="text-[10px] text-green-200 capitalize">{currentUser?.role}</span>
          </div>
          <button onClick={logout} className="p-1.5 hover:bg-green-500 rounded-lg transition-colors" title="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-green-100 shadow-sm">
          <nav className="flex-1 py-3">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === path
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-green-100 bg-green-50">
            <p className="text-[10px] text-green-600 font-medium">NAMOORA MANDI</p>
            <p className="text-[10px] text-gray-500 mt-0.5">No 80/3, Mandi No. 1083</p>
            <p className="text-[10px] text-gray-500">Opp. Thippasandra Market</p>
            <p className="text-[10px] text-gray-500">Bengaluru - 560075</p>
            <p className="text-[10px] text-green-600 mt-1 font-medium">+91 95138 03912</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-4">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 flex z-30 shadow-lg">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 text-xs transition-colors ${
              pathname === path
                ? "text-green-600"
                : "text-gray-400 hover:text-green-500"
            }`}
          >
            <Icon size={20} strokeWidth={pathname === path ? 2.5 : 1.8} />
            <span className="mt-0.5 text-[10px] font-medium">{label}</span>
            {pathname === path && <div className="absolute bottom-0 w-8 h-0.5 bg-green-500 rounded-full" />}
          </Link>
        ))}
      </nav>
    </div>
  );
}
