import { Routes, Route, Navigate } from 'react-router-dom'; 
import VendorPage from './pages/VendorPage';
import PartsPage from './pages/PartsPage';
import PurchaseInvoicePage from './pages/PurchaseInvoicePage';

function App() {
  // Navigation
  return (
    <Routes>
      <Route path="/vendors" element={<VendorPage />} />
      <Route path="/parts" element={<PartsPage />} />
      <Route path="/invoices" element={<PurchaseInvoicePage />} />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/vendors" />} />
    </Routes>
  );
}

export default App;