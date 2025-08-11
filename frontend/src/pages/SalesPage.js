import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ customer_id: '', total_amount: '' });

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = () => {
    axios.get('https://store-r-2025.azurewebsites.net/sales', { headers: { 'X-User-Role': 'manager' } })
      .then(res => setSales(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://store-r-2025.azurewebsites.net/sales', form, { headers: { 'X-User-Role': 'manager' } })
      .then(() => { fetchSales(); setForm({ customer_id: '', total_amount: '' }); })
      .catch(err => console.error(err));
  };

  const downloadInvoice = (id) => {
    window.open(`https://store-r-2025.azurewebsites.net/invoice/${id}`, '_blank');
  };

  return (
    <div>
      <h2>Sales</h2>
      <form onSubmit={handleSubmit}>
        <input name="customer_id" placeholder="Customer ID" value={form.customer_id} onChange={handleChange} required />
        <input name="total_amount" placeholder="Total Amount" value={form.total_amount} onChange={handleChange} required />
        <button type="submit">Add Sale</button>
      </form>
      <ul>
        {sales.map(s => (
          <li key={s.id}>
            Sale #{s.id} - ${s.total_amount} 
            <button onClick={() => downloadInvoice(s.id)}>Invoice</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
