import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock_qty: '', warranty_period_months: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = () => {
    axios.get('https://store-r-2025.azurewebsites.net/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://store-r-2025.azurewebsites.net/products', form, { headers: { 'X-User-Role': 'admin' } })
      .then(() => { fetchProducts(); setForm({ name: '', price: '', stock_qty: '', warranty_period_months: '' }); })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock_qty" placeholder="Stock Qty" value={form.stock_qty} onChange={handleChange} />
        <input name="warranty_period_months" placeholder="Warranty (months)" value={form.warranty_period_months} onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ${p.price} ({p.stock_qty} in stock)</li>
        ))}
      </ul>
    </div>
  );
}
