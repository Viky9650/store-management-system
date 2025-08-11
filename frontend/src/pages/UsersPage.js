import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', role: 'customer' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('https://store-r-2025.azurewebsites.net/users', { headers: { 'X-User-Role': 'admin' } })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://store-r-2025.azurewebsites.net/users', form, { headers: { 'X-User-Role': 'admin' } })
      .then(() => {
        fetchUsers();
        setForm({ name: '', email: '', phone: '', address: '', role: 'customer' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fefefe',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: 'border-box',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#34495e' }}>Users Management</h1>
      
      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
      }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={inputStyle}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ ...inputStyle, gridColumn: 'span 2' }}
        >
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={submitButtonStyle}>Add User</button>
      </form>

      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Users List</h2>
      {users.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No users found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map(u => (
            <li key={u.id} style={{
              backgroundColor: '#fff',
              padding: '15px 20px',
              marginBottom: '12px',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '15px',
              color: '#34495e'
            }}>
              <div>
                <strong>{u.name}</strong> ({u.role}) - {u.email}
                {u.phone && ` | Phone: ${u.phone}`}
                {u.address && ` | Address: ${u.address}`}
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
  width: '100%',
};

const submitButtonStyle = {
  padding: '12px',
  fontSize: '16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#2980b9',
  color: '#fff',
  fontWeight: '600',
  gridColumn: 'span 2',
  transition: 'background-color 0.3s ease',
};
