import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import axios from './api/axios.js'
import './App.css'
import SearchCustomer from "./pages/staff/SearchCustomer"
import CustomerDetails from "./pages/staff/CustomerDetails"

function App() {
  return (
    <BrowserRouter>
      <div style={styles.wrapper}>

        <nav style={styles.nav}>
          <span style={styles.navBrand}>Vehicle System</span>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Search</Link>
            <Link to="/customers/1" style={styles.navLink}>Customer Details</Link>
          </div>
        </nav>

        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<SearchCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetailsWrapper />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}

function CustomerDetailsWrapper() {
  const id = window.location.pathname.split("/").pop();
  return <CustomerDetails id={id} />;
}

const styles = {
  wrapper: { fontFamily: "sans-serif", minHeight: "100vh", background: "#fafafa" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "#fff", borderBottom: "0.5px solid #e0e0e0" },
  navBrand: { fontWeight: 500, fontSize: 16, color: "#0C447C" },
  navLinks: { display: "flex", gap: 16 },
  navLink: { fontSize: 14, color: "#555", textDecoration: "none" },
  content: { maxWidth: 720, margin: "0 auto", padding: "24px 16px" },
};

export default App