import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { User, CalendarClock, History, ShoppingCart, LogOut, Package } from "lucide-react";
import { getCustomer, isLoggedIn, clearSession } from "../api/auth";

const navItems = [
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "Services", icon: CalendarClock, path: "/services" },
  { label: "Buy Parts", icon: ShoppingCart, path: "/purchase" },
  { label: "My History", icon: History, path: "/history" },
];

export default function CustomerLayout() {
  const navigate = useNavigate();
  const customer = getCustomer();

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col bg-[#071B33] text-white">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500">
            <Package size={22} />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight">
              AUTO<span className="text-indigo-300">PART</span>
            </div>
            <p className="mt-0.5 text-[11px] tracking-[0.25em] text-slate-300">CUSTOMER</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h2 className="text-lg font-semibold text-slate-900">Customer Portal</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071B33] text-sm font-semibold text-white">
              {(customer?.name || "C").charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{customer?.name || "Customer"}</p>
              <p className="text-xs text-slate-500">{customer?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
