import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ customer_id: '', product_id: '', issue_description: '', assigned_to: '' });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = () => {
    axios.get('https://store-r-2025.azurewebsites.net/service-requests', { headers: { 'X-User-Role': 'manager' } })
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://store-r-2025.azurewebsites.net/service-requests', form, { headers: { 'X-User-Role': 'employee' } })
      .then(() => { fetchRequests(); setForm({ customer_id: '', product_id: '', issue_description: '', assigned_to: '' }); })
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
    <div>
      <h2>Service Requests</h2>
      <form onSubmit={handleSubmit}>
        <input name="customer_id" placeholder="Customer ID" value={form.customer_id} onChange={handleChange} required />
        <input name="product_id" placeholder="Product ID" value={form.product_id} onChange={handleChange} required />
        <input name="issue_description" placeholder="Issue" value={form.issue_description} onChange={handleChange} required />
        <input name="assigned_to" placeholder="Assigned To" value={form.assigned_to} onChange={handleChange} />
        <button type="submit">Create</button>
      </form>

      <h3>Requests List</h3>
      <ul>
        {requests.map(r => (
          <li key={r.id}>
            {r.issue_description} - {r.status} - Approval: {r.approval_status}
            <button onClick={() => downloadPDF(r.id)}>PDF</button>
            {r.approval_status === 'Pending' && (
              <>
                <button onClick={() => approveUpdate(r.id, true)}>Approve</button>
                <button onClick={() => approveUpdate(r.id, false)}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
