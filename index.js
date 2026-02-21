import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Connection failed:', err);
  else console.log('Connected to Supabase! Time:', res.rows[0]);
});

// Search by Name
app.get('/api/people', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing name query parameter' });

  try {
    const query = `
      SELECT seating."firstName", seating."lastName", seating."tableNumber"
      FROM seating
      WHERE seating."firstName" ILIKE $1 OR seating."lastName" ILIKE $1
      ORDER BY seating."lastName" ASC
    `;
    const result = await pool.query(query, [`%${name}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Search by Table
app.get('/api/table/:tableNumber', async (req, res) => {
  const tableNumber = req.params.tableNumber;

  try {
    const query = `
      SELECT seating."firstName", seating."lastName"
      FROM seating
      WHERE seating."tableNumber" = $1
      ORDER BY seating."lastName" ASC
    `;
    const result = await pool.query(query, [tableNumber]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));typoe