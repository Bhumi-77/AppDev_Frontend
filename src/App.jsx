import { useState } from 'react';
import VendorPage from './pages/VendorPage';
import PartsPage from './pages/PartsPage';
import PurchaseInvoicePage from './pages/PurchaseInvoicePage';

function App() {
  const [activePage, setActivePage] = useState('vendors');

  return (
    <div style={navStyles.appWrapper}>
      {/* Navigation tabs */}
      <nav style={navStyles.nav}>
        <div style={navStyles.navInner}>
          <span style={navStyles.brand}>VehicleParts System</span>
          <div style={navStyles.tabs}>
            <button
              style={activePage === 'vendors' ? navStyles.activeTab : navStyles.tab}
              onClick={() => setActivePage('vendors')}
            >
              Vendors
            </button>
            <button
              style={activePage === 'parts' ? navStyles.activeTab : navStyles.tab}
              onClick={() => setActivePage('parts')}
            >
              Parts
            </button>
            <button 
              style={activePage === 'invoices' ? navStyles.activeTab : navStyles.tab} 
              onClick={() => setActivePage('invoices')}
            >
              Purchase Invoices
            </button>
          </div>
        </div>
      </nav>

      <main style={navStyles.content}>
        {activePage === 'vendors' && <VendorPage />}
        {activePage === 'parts' && <PartsPage />}
        {activePage === 'invoices' && <PurchaseInvoicePage />}
      </main>
    </div>
  );
}

const navStyles = {
  appWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  nav: { 
    backgroundColor: "#0f172a", 
    padding: "0 20px", 
    position: "sticky", 
    top: 0, 
    zIndex: 100,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navInner: { 
    maxWidth: "1350px", 
    margin: "0 auto", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between", 
    height: "64px",
  },
  brand: { 
    color: "#fff", 
    fontWeight: "800", 
    fontSize: "18px", 
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.5px",
  },
  tabs: { 
    display: "flex", 
    gap: "8px",
  },
  tab: { 
    backgroundColor: "transparent", 
    color: "#94a3b8", 
    border: "none", 
    padding: "10px 20px", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "14px", 
    fontWeight: "600",
    transition: "all 0.2s",
  },
  activeTab: { 
    backgroundColor: "#4f46e5", 
    color: "#fff", 
    border: "none", 
    padding: "10px 20px", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "14px", 
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.4)",
  },
  content: {
    paddingBottom: "40px",
  },
};

export default App;