import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ customer_id: '', product_id: '', issue_description: '', assigned_to: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios.get('https://store-r-2025.azurewebsites.net/service-requests', { headers: { 'X-User-Role': 'manager' } })
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://store-r-2025.azurewebsites.net/service-requests', form, { headers: { 'X-User-Role': 'employee' } })
      .then(() => {
        fetchRequests();
        setForm({ customer_id: '', product_id: '', issue_description: '', assigned_to: '' });
      })
      .catch(err => console.error(err));
  };

  const approveUpdate = (id, approve) => {
    axios.put(`https://store-r-2025.azurewebsites.net/service-requests/${id}/approve-update`, { approve }, { headers: { 'X-User-Role': 'manager' } })
      .then(() => fetchRequests())
      .catch(err => console.error(err));
  };

  const downloadPDF = (id) => {
    window.open(`https://store-r-2025.azurewebsites.net/service-request-pdf/${id}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      backgroundColor: '#fafafa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: 'border-box',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50', textAlign: 'center' }}>Service Requests</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '40px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
          name="product_id"
          placeholder="Product ID"
          value={form.product_id}
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
          style={{ ...inputStyle, gridColumn: 'span 2' }}
        />
        <input
          name="assigned_to"
          placeholder="Assigned To"
          value={form.assigned_to}
          onChange={handleChange}
          style={inputStyle}
        />
        <button type="submit" style={submitButtonStyle}>Create Request</button>
      </form>

      <h2 style={{ marginBottom: '20px', color: '#34495e' }}>Requests List</h2>
      {requests.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No service requests found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {requests.map(r => (
            <li key={r.id} style={{
              backgroundColor: '#fff',
              marginBottom: '15px',
              padding: '15px 20px',
              borderRadius: '8px',
              boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ fontWeight: '600', fontSize: '16px', color: '#2c3e50' }}>{r.issue_description}</div>
              <div>Status: <strong>{r.status}</strong></div>
              <div>Approval: <strong>{r.approval_status}</strong></div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => downloadPDF(r.id)} style={buttonStyle}>Download PDF</button>
                {r.approval_status === 'Pending' && (
                  <>
                    <button onClick={() => approveUpdate(r.id, true)} style={{ ...buttonStyle, backgroundColor: '#27ae60' }}>Approve</button>
                    <button onClick={() => approveUpdate(r.id, false)} style={{ ...buttonStyle, backgroundColor: '#c0392b' }}>Reject</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  fontSize: '15px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
  width: '100%'
};

const buttonStyle = {
  padding: '8px 15px',
  fontSize: '14px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#2980b9',
  color: '#fff',
  transition: 'background-color 0.3s ease'
};

const submitButtonStyle = {
  ...buttonStyle,
  gridColumn: 'span 2',
  backgroundColor: '#3498db',
  fontWeight: '600'
};
