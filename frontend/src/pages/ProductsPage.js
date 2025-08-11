import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock_qty: '', warranty_period_months: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('https://store-r-2025.azurewebsites.net/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch products.');
        setLoading(false);
      });
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setStatus('');
    setError('');

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock_qty: parseInt(form.stock_qty) || 0,
      warranty_period_months: parseInt(form.warranty_period_months) || 0,
    };

    axios.post('https://store-r-2025.azurewebsites.net/products', payload, { headers: { 'X-User-Role': 'admin' } })
      .then(() => {
        fetchProducts();
        setForm({ name: '', price: '', stock_qty: '', warranty_period_months: '' });
        setStatus('Product added successfully!');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to add product.');
      });
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f5f7fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Products Management</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '40px',
        width: '100%',
        maxWidth: '1000px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: '1 1 350px',
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <h2 style={{ marginBottom: '15px', color: '#0070f3' }}>Add New Product</h2>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="stock_qty"
            type="number"
            placeholder="Stock Quantity"
            value={form.stock_qty}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="warranty_period_months"
            type="number"
            placeholder="Warranty Period (months)"
            value={form.warranty_period_months}
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>Add Product</button>

          {status && <p style={{ color: 'green', marginTop: '10px' }}>{status}</p>}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>

        {/* Products List Section */}
        <div style={{
          flex: '1 1 600px',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#0070f3' }}>Product List</h2>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {products.map(p => (
                <li
                  key={p.id}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong>{p.name}</strong> — ${p.price.toFixed(2)} <br />
                    <small>{p.stock_qty} in stock | Warranty: {p.warranty_period_months} months</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Shared styles for inputs and button
const inputStyle = {
  padding: '10px',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const buttonStyle = {
  padding: '12px',
  fontSize: '1rem',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px',
};

