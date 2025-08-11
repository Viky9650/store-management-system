import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ customer_id: '', total_amount: '' });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = () => {
    axios.get('https://store-r-2025.azurewebsites.net/sales', { headers: { 'X-User-Role': 'manager' } })
      .then(res => setSales(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://store-r-2025.azurewebsites.net/sales', form, { headers: { 'X-User-Role': 'manager' } })
      .then(() => {
        fetchSales();
        setForm({ customer_id: '', total_amount: '' });
      })
      .catch(err => console.error(err));
  };

  const downloadInvoice = (id) => {
    window.open(`https://store-r-2025.azurewebsites.net/invoice/${id}`, '_blank');
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '50px auto',
      padding: '25px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Sales Records</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '35px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <input
          name="customer_id"
          placeholder="Customer ID"
          value={form.customer_id}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="total_amount"
          type="number"
          placeholder="Total Amount"
          value={form.total_amount}
          onChange={handleChange}
          required
          style={inputStyle}
          min="0"
          step="0.01"
        />
        <button type="submit" style={submitButtonStyle}>Add Sale</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sales.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No sales records found.</p>
        ) : (
          sales.map(s => (
            <li key={s.id} style={saleItemStyle}>
              <div>
                <strong>Sale #{s.id}</strong> — ${parseFloat(s.total_amount).toFixed(2)}
              </div>
              <button
                onClick={() => downloadInvoice(s.id)}
                style={invoiceButtonStyle}
                aria-label={`Download invoice for sale #${s.id}`}
              >
                Invoice
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const inputStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  flexGrow: 1,
  minWidth: '150px',
  boxSizing: 'border-box',
};

const submitButtonStyle = {
  padding: '11px 25px',
  fontSize: '16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#2980b9',
  color: '#fff',
  fontWeight: '600',
  transition: 'background-color 0.3s ease',
  flexShrink: 0,
};

const saleItemStyle = {
  backgroundColor: '#fff',
  marginBottom: '12px',
  padding: '15px 20px',
  borderRadius: '8px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '16px',
  color: '#34495e',
};

const invoiceButtonStyle = {
  backgroundColor: '#27ae60',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'background-color 0.3s ease',
};
