import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [form, setForm] = useState({ sale_item_id: '', issue_description: '', status: 'Pending', resolution_notes: '' });

  useEffect(() => { fetchClaims(); }, []);

  const fetchClaims = () => {
    axios.get('http://localhost:3001/claims', { headers: { 'X-User-Role': 'employee' } })
      .then(res => setClaims(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:3001/claims', form, { headers: { 'X-User-Role': 'employee' } })
      .then(() => { fetchClaims(); setForm({ sale_item_id: '', issue_description: '', status: 'Pending', resolution_notes: '' }); })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Claims</h2>
      <form onSubmit={handleSubmit}>
        <input name="sale_item_id" placeholder="Sale Item ID" value={form.sale_item_id} onChange={handleChange} required />
        <input name="issue_description" placeholder="Issue" value={form.issue_description} onChange={handleChange} required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Pending</option>
          <option>Approved</option>
          <option>Repaired</option>
          <option>Rejected</option>
        </select>
        <input name="resolution_notes" placeholder="Resolution Notes" value={form.resolution_notes} onChange={handleChange} />
        <button type="submit">Add Claim</button>
      </form>
      <ul>
        {claims.map(c => (
          <li key={c.id}>{c.issue_description} - {c.status}</li>
        ))}
      </ul>
    </div>
  );
}
