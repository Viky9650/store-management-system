import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import PDFDocument from 'pdfkit';
import { format } from '@fast-csv/format';

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// ===== Database Connection =====
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ===== Middleware: Role Checking =====
function checkRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role'] || 'customer'; // Simulated role
    req.user = { role: userRole };
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

// ===== USERS =====
app.get('/users', checkRole(['admin', 'manager']), async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, phone, address, role, created_at FROM users ORDER BY id DESC'
  );
  res.json(result.rows);
});

app.post('/users', checkRole(['admin']), async (req, res) => {
  const { name, email, phone, address, role } = req.body;
  await pool.query(
    'INSERT INTO users (name, email, phone, address, role) VALUES ($1, $2, $3, $4, $5)',
    [name, email, phone, address, role || 'customer']
  );
  res.json({ message: 'User added successfully' });
});

// ===== PRODUCTS =====
app.get('/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

app.post('/products', checkRole(['admin', 'manager']), async (req, res) => {
  const { name, price, stock_qty, warranty_period_months } = req.body;
  await pool.query(
    'INSERT INTO products (name, price, stock_qty, warranty_period_months) VALUES ($1, $2, $3, $4)',
    [name, price, stock_qty, warranty_period_months]
  );
  res.json({ message: 'Product added' });
});

app.delete('/products/:id', checkRole(['admin']), async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM products WHERE id=$1', [id]);
  res.json({ message: 'Product deleted' });
});

// ===== SALES =====
app.get('/sales', checkRole(['admin', 'manager', 'employee']), async (req, res) => {
  const result = await pool.query('SELECT * FROM sales');
  res.json(result.rows);
});

app.post('/sales', checkRole(['admin', 'manager', 'employee']), async (req, res) => {
  const { customer_id, total_amount } = req.body;
  await pool.query(
    'INSERT INTO sales (customer_id, total_amount) VALUES ($1, $2)',
    [customer_id, total_amount]
  );
  res.json({ message: 'Sale recorded' });
});

// ===== CLAIMS =====
app.get('/claims', checkRole(['admin', 'manager', 'employee']), async (req, res) => {
  const result = await pool.query('SELECT * FROM claims');
  res.json(result.rows);
});

app.post('/claims', checkRole(['admin', 'manager', 'employee']), async (req, res) => {
  const { sale_item_id, issue_description, status, resolution_notes } = req.body;
  await pool.query(
    'INSERT INTO claims (sale_item_id, issue_description, status, resolution_notes) VALUES ($1, $2, $3, $4)',
    [sale_item_id, issue_description, status, resolution_notes]
  );
  res.json({ message: 'Claim added' });
});

// ===== FEEDBACK =====
app.post('/feedback', async (req, res) => {
  const { name, email, message } = req.body;
  await pool.query(
    'INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)',
    [name, email, message]
  );
  res.json({ message: 'Feedback submitted' });
});

// ===== CATALOG =====
app.get('/catalog', async (req, res) => {
  const result = await pool.query('SELECT id, name, price, stock_qty FROM products');
  res.json(result.rows);
});

// ===== SERVICE REQUESTS =====
app.post('/service-requests', checkRole(['admin', 'manager', 'employee']), async (req, res) => {
  const { customer_id, product_id, issue_description, assigned_to } = req.body;
  await pool.query(
    'INSERT INTO service_requests (customer_id, product_id, issue_description, assigned_to, approval_status) VALUES ($1, $2, $3, $4, $5)',
    [customer_id, product_id, issue_description, assigned_to, 'Approved']
  );
  res.json({ message: 'Service request created' });
});

app.put('/service-requests/:id/request-update', checkRole(['employee']), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  await pool.query(
    'UPDATE service_requests SET pending_update = $1, approval_status = $2 WHERE id = $3',
    [updates, 'Pending', id]
  );
  res.json({ message: 'Update request sent for manager approval' });
});

app.put('/service-requests/:id/approve-update', checkRole(['manager', 'admin']), async (req, res) => {
  const { id } = req.params;
  const { approve } = req.body;

  const result = await pool.query('SELECT pending_update FROM service_requests WHERE id=$1', [id]);
  const pendingUpdate = result.rows[0]?.pending_update;

  if (!pendingUpdate) {
    return res.status(400).json({ error: 'No pending update found' });
  }

  if (approve) {
    const fields = Object.keys(pendingUpdate).map((key, idx) => `${key}=$${idx+1}`);
    const values = Object.values(pendingUpdate);
    await pool.query(
      `UPDATE service_requests SET ${fields.join(', ')}, pending_update=NULL, approval_status='Approved' WHERE id=$${values.length+1}`,
      [...values, id]
    );
    res.json({ message: 'Update approved and applied' });
  } else {
    await pool.query(
      'UPDATE service_requests SET pending_update=NULL, approval_status=$1 WHERE id=$2',
      ['Rejected', id]
    );
    res.json({ message: 'Update rejected' });
  }
});

// ===== REPORTS CSV =====
app.get('/monthly-report-csv/:year/:month', checkRole(['admin', 'manager']), async (req, res) => {
  const { year, month } = req.params;

  const salesTotal = await pool.query(
    `SELECT COALESCE(SUM(total_amount), 0) AS total_sales 
     FROM sales 
     WHERE EXTRACT(YEAR FROM sale_date) = $1 
     AND EXTRACT(MONTH FROM sale_date) = $2`,
    [year, month]
  );

  const productsSold = await pool.query(
    `SELECT COALESCE(SUM(quantity), 0) AS total_products_sold
     FROM sale_items si
     JOIN sales s ON s.id = si.sale_id
     WHERE EXTRACT(YEAR FROM s.sale_date) = $1 
     AND EXTRACT(MONTH FROM s.sale_date) = $2`,
    [year, month]
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=monthly-report-${month}-${year}.csv`);

  const csvStream = format({ headers: true });
  csvStream.pipe(res);
  csvStream.write({
    Year: year,
    Month: month,
    Total_Sales: salesTotal.rows[0].total_sales,
    Total_Products_Sold: productsSold.rows[0].total_products_sold
  });
  csvStream.end();
});

// ===== INVOICE PDF =====
app.get('/invoice/:saleId', checkRole(['admin', 'manager']), async (req, res) => {
  const { saleId } = req.params;
  const sale = await pool.query('SELECT * FROM sales WHERE id=$1', [saleId]);
  const items = await pool.query('SELECT * FROM sale_items WHERE sale_id=$1', [saleId]);

  if (sale.rows.length === 0) {
    return res.status(404).json({ error: 'Sale not found' });
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${saleId}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown();
  doc.text(`Sale ID: ${saleId}`);
  doc.text(`Date: ${sale.rows[0].sale_date}`);
  doc.text(`Total Amount: $${sale.rows[0].total_amount}`);
  doc.moveDown();
  doc.text('Items:');

  items.rows.forEach(item => {
    doc.text(`Product ${item.product_id} - Qty: ${item.quantity} - $${item.price}`);
  });

  doc.end();
});

// ===== SERVICE REQUEST PDF =====
app.get('/service-request-pdf/:id', checkRole(['admin', 'manager', 'employee']), async (req, res) => {
  const { id } = req.params;
  const request = await pool.query('SELECT * FROM service_requests WHERE id=$1', [id]);

  if (request.rows.length === 0) {
    return res.status(404).json({ error: 'Service request not found' });
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=service-request-${id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text('Service Request', { align: 'center' }).moveDown();
  doc.text(`Request ID: ${id}`);
  doc.text(`Customer ID: ${request.rows[0].customer_id}`);
  doc.text(`Product ID: ${request.rows[0].product_id}`);
  doc.text(`Status: ${request.rows[0].status}`);
  doc.text(`Issue: ${request.rows[0].issue_description}`);
  doc.text(`Assigned To: ${request.rows[0].assigned_to}`);
  doc.text(`Resolution: ${request.rows[0].resolution_notes || 'Pending'}`);
  doc.text(`Approval Status: ${request.rows[0].approval_status}`);

  doc.end();
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
