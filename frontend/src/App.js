import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import ClaimsPage from './pages/ClaimsPage';
import ServiceRequestsPage from './pages/ServiceRequestsPage';
import ReportsPage from './pages/ReportsPage';
import CatalogPage from './pages/CatalogPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Products</Link> |{" "}
        <Link to="/users">Users</Link> |{" "}
        <Link to="/sales">Sales</Link> |{" "}
        <Link to="/claims">Claims</Link> |{" "}
        <Link to="/service-requests">Service Requests</Link> |{" "}
        <Link to="/reports">Reports</Link> |{" "}
        <Link to="/catalog">Catalog</Link> |{" "}
        <Link to="/contact">Contact Us</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/service-requests" element={<ServiceRequestsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}
