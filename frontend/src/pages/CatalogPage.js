import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://store-r-2025.azurewebsites.net/catalog')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Product Catalog</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ${p.price} ({p.stock_qty} in stock)</li>
        ))}
      </ul>
    </div>
  );
}
