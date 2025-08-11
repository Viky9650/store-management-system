import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://store-r-2025.azurewebsites.net/catalog')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f0f2f5',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#34495e', textAlign: 'center' }}>Product Catalog</h1>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading products...</p>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No products available.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {products.map(p => (
            <div key={p.id} style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '160px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{p.name}</h3>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>${p.price}</p>
              <p style={{ margin: '5px 0', color: p.stock_qty > 0 ? '#27ae60' : '#c0392b' }}>
                {p.stock_qty} {p.stock_qty === 1 ? 'item' : 'items'} in stock
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
