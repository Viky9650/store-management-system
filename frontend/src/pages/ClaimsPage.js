import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [form, setForm] = useState({ sale_item_id: '', issue_description: '', status: 'Pending', resolution_notes: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = () => {
    setLoading(true);
    axios.get('https://store-r-2025.azurewebsites.net/claims', { headers: { 'X-User-Role': 'employee' } })
      .then(res => {
        setClaims(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch claims.');
        setLoading(false);
      });
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setStatus('');
    setError('');

    axios.post('https://store-r-2025.azurewebsites.net/claims', form, { headers: { 'X-User-Role': 'employee' } })
      .then(() => {
        fetchClaims();
        setForm({ sale_item_id: '', issue_description: '', status: 'Pending', resolution_notes: '' });
        setStatus('Claim submitted successfully!');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to submit claim.');
      });
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f0f2f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Claims Management</h1>
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
          <h2 style={{ marginBottom: '15px', color: '#2980b9' }}>Add New Claim</h2>

          <input
            name="sale_item_id"
            placeholder="Sale Item ID"
            value={form.sale_item_id}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="issue_description"
            placeholder="Issue Description"
            value={form.issue_description}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ ...inputStyle, padding: '10px' }}
          >
            <option>Pending</option>
            <option>Approved</option>
            <option>Repaired</option>
            <option>Rejected</option>
          </select>
          <input
            name="resolution_notes"
            placeholder="Resolution Notes"
            value={form.resolution_notes}
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>Submit Claim</button>

          {status && <p style={{ color: 'green', marginTop: '10px' }}>{status}</p>}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>

        {/* Claims List Section */}
        <div style={{
          flex: '1 1 600px',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#2980b9' }}>Claims List</h2>

          {loading ? (
            <p>Loading claims...</p>
          ) : claims.length === 0 ? (
            <p>No claims found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {claims.map(c => (
                <li
                  key={c.id}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <strong>{c.issue_description}</strong>
                  <span><b>Status:</b> {c.status}</span>
                  {c.resolution_notes && <span><b>Resolution:</b> {c.resolution_notes}</span>}
                  <small><b>Sale Item ID:</b> {c.sale_item_id}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

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
  backgroundColor: '#2980b9',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px',
};
