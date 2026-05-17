import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Layers,
  FileText,
  Receipt,
  BarChart3,
  AlertTriangle,
  Brain,
  Settings,
  Bell,
  Search,
  Menu,
  ChevronDown,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  MailWarning,
  ShieldCheck,
  UserPlus,
  ClipboardList,
} from "lucide-react";

const sidebarSections = [
  {
    items: [{ label: "Dashboard", icon: LayoutDashboard, path: "/" }],
  },
  {
    items: [
      { label: "Staff Management", icon: Users, path: "/staff-management" },
     
    ],
  },
  {
   
    items: [
      { label: "Vendor Management", icon: Truck, path: "/vendor-management" },
      { label: "Parts Management", icon: Package, path: "/parts-management" },
      { label: "Stock Overview", icon: Layers, path: "/stock-overview" },
      { label: "Purchase Invoices", icon: FileText, path: "/purchase-invoices" },
      { label: "Sales Invoices", icon: Receipt, path: "/sales-invoices" },
    ],
  },
  {
    
    items: [
      { label: "Financial Reports", icon: BarChart3, path: "/financial-reports" },
    ],
  },
  {
    
    items: [
      { label: "Low Stock Alerts", icon: AlertTriangle, path: "/low-stock-alerts" },
      { label: "Pending Credit Reminders", icon: MailWarning, path: "/pending-credit-reminders" },
      { label: "AI Predictive Alerts", icon: Brain, path: "/ai-predictive-alerts" },
    ],
  },
];

const navigationItems = sidebarSections.flatMap((section) => section.items ?? []);

export default function AdminLayout() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications/low-stock");
      setNotifications(response.data);
    } catch {
      setNotifications([]);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-[#071B33] text-white h-screen flex flex-col">
        {/* Logo */}
        <div className="h-20 shrink-0 flex items-center gap-3 px-5 border-b border-white/10">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-teal-500 flex items-center justify-center">
            <Package size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="whitespace-nowrap text-[1.9rem] font-black leading-none tracking-[-0.08em] text-white">
              AUTO<span className="text-teal-200">PART</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300 tracking-[0.25em]">
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Profile */}
        <div className="p-4 shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[#071B33] font-bold">
              A
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Admin User</p>
              <p className="text-xs text-slate-300 truncate">
                System Administrator
              </p>
            </div>

            <ChevronDown size={17} className="text-slate-300" />
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            

            <div className="relative w-full max-w-xl">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search staff, reports, low stock alerts, pending credits..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-gray-100"
              >
                <Bell size={22} className="text-slate-700" />

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-600">
                      {notifications.length} alerts
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-5 py-6 text-sm text-slate-500">
                        No low stock notifications.
                      </p>
                    ) : (
                      notifications.slice(0, 4).map((item) => (
                        <div
                          key={item.partId}
                          className="border-b border-gray-100 px-5 py-4 hover:bg-gray-50"
                        >
                          <p className="text-sm font-semibold text-red-600">
                            Low Stock Alert
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            {item.partName} has only {item.stockQuantity} units
                            left.
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <NavLink
                    to="/low-stock-alerts"
                    onClick={() => setShowNotifications(false)}
                    className="block px-5 py-4 text-center text-sm font-semibold text-teal-600 hover:bg-teal-50"
                  >
                    View all low stock alerts
                  </NavLink>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[#071B33] text-white flex items-center justify-center font-semibold">
                AU
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">
                  Admin User
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>

              <ChevronDown size={18} className="text-slate-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
