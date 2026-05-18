import { useNavigate, useLocation } from "react-router-dom"; 
import {
  LayoutDashboard, Users, Truck, Package, Layers, FileText, Receipt,
  BarChart3, AlertTriangle, Brain, Settings, Bell, Search, Menu, ChevronDown,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Staff Management", path: "/staff", icon: Users },
  { label: "Vendor Management", path: "/vendors", icon: Truck },
  { label: "Parts Management", path: "/parts", icon: Package },
  { label: "Stock Overview", path: "/stock", icon: Layers },
  { label: "Purchase Invoices", path: "/invoices", icon: FileText },
  { label: "Sales Invoices", path: "/sales", icon: Receipt },
  { label: "Financial Reports", path: "/reports", icon: BarChart3 },
  { label: "Low Stock Alerts", path: "/alerts", icon: AlertTriangle },
  { label: "AI Predictive Alerts", path: "/ai", icon: Brain },
  { label: "Settings", path: "/settings", icon: Settings },
];

// Navigation 
export default function AdminLayout({ children }) { 
  const navigate = useNavigate(); 
  const location = useLocation(); 

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#071B33] text-white min-h-screen flex flex-col fixed">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="h-11 w-11 rounded-xl bg-teal-500 flex items-center justify-center mr-3">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">AUTO<span className="text-teal-400">FLOW</span></h1>
            <p className="text-xs text-slate-300 tracking-widest">ADMIN PANEL</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            // Active Page
            const isActive = location.pathname === item.path; 

            return (
              <button 
                key={item.label} 
                onClick={() => navigate(item.path)} // Logic to switch pages
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col ml-72"> 
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <Search size={20} className="text-slate-400" />
            <input type="text" placeholder="Search..." className="w-full max-w-xl h-12 bg-transparent outline-none text-sm" />
          </div>
          <div className="flex items-center gap-5">
            <Bell size={22} className="text-slate-700" />
            <div className="h-11 w-11 rounded-full bg-[#071B33] text-white flex items-center justify-center font-semibold">AU</div>
          </div>
        </header>

        <main className="p-8">

        {/* Vendor Page */}
          {children} 
        </main>
      </div>
    </div>
  );
}