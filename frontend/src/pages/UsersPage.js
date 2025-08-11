import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', role: 'customer' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3001/users', { headers: { 'X-User-Role': 'admin' } })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:3001/users', form, { headers: { 'X-User-Role': 'admin' } })
      .then(() => { fetchUsers(); setForm({ name: '', email: '', phone: '', address: '', role: 'customer' }); })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Users</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} ({u.role}) - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
