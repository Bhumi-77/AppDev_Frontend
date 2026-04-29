import { useState } from 'react';
import VendorPage from './pages/VendorPage';
import PartsPage from './pages/PartsPage';

function App() {
  const [activePage, setActivePage] = useState('vendors');

  return (
    <div>
      {/* Simple navigation tabs */}
      <div style={navStyles.nav}>
        <div style={navStyles.navInner}>
          <span style={navStyles.brand}>🚗 VehicleParts System</span>
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
          </div>
        </div>
      </div>

      {activePage === 'vendors' && <VendorPage />}
      {activePage === 'parts' && <PartsPage />}
    </div>
  );
}

const navStyles = {
  nav: { 
    backgroundColor: "#0f172a", 
    padding: "0 20px", 
    position: "sticky", 
    top: 0, 
    zIndex: 100
  },
  navInner: { 
    maxWidth: "1350px", 
    margin: "0 auto", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between", 
    height: "60px" 
  },
  brand: { 
    color: "#fff", 
    fontWeight: "800", 
    fontSize: "16px", 
    fontFamily: "'Inter', sans-serif" 
  },
  tabs: { 
    display: "flex", 
    gap: "4px" 
  },
  tab: { 
    backgroundColor: "transparent", 
    color: "#94a3b8", 
    border: "none", 
    padding: "8px 18px", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "14px", 
    fontWeight: "600" 
  },
  activeTab: { 
    backgroundColor: "#4f46e5", 
    color: "#fff", 
    border: "none", 
    padding: "8px 18px", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "14px", 
    fontWeight: "600" 
  },
};

export default App;