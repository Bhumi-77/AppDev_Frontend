import { useState } from 'react';
import VendorPage from './pages/VendorPage';
import PartsPage from './pages/PartsPage';
import PurchaseInvoicePage from './pages/PurchaseInvoicePage';

function App() {
  const [activePage, setActivePage] = useState('vendors');

  return (
    // Navigation
    <div>
      {activePage === 'vendors' && <VendorPage />}
      {activePage === 'parts' && <PartsPage />}
      {activePage === 'invoices' && <PurchaseInvoicePage />}
    </div>
  );
}

export default App;