import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
//import insertData from './controllers/insertData.js';  // Import the insertData function

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Test DB connection
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to Supabase! Time:', res.rows[0].now);
  } catch (err) {
    console.error('DB Connection failed:', err);
  }
})();

// Test route
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Create table endpoint
app.get('/api/create-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS seating (
      id SERIAL PRIMARY KEY,
      "firstname" VARCHAR(50) NOT NULL,
      "lastname" VARCHAR(50) NOT NULL,
      "tablenumber" INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // Execute the query to create the table
    await pool.query(createTableQuery);
    res.status(200).json({ message: 'Table "seating" created successfully!' });
  } catch (err) {
    console.error('Error creating table:', err);
    res.status(500).json({ error: 'Error creating table: ' + err.message });
  }
});

// Insert Data endpoint (now in insertData.js)
//Insert Data endpoint
app.get('/api/insert-data', async (req, res) => {
  const insertQuery = `
      INSERT INTO seating ("firstname", "lastname", "tablenumber")
      VALUES 
('Robin','Applewood',1),
('Gordon','Cann',1),
('Susan','Cann',1),
('Alamu','Lakshmanan',1),
('Shanmugam','Lakshmanan',1),
('Vanessa','Lord',1),
('Guhan','Nagappan',1),
('Alagu','Thenappan',1),
('Nethra','Thenappan',1),
('Ravi','Thenappan',1),
('Sam','Cronin',5),
('Megan','Houlihan',5),
('Geoffrey','Lalonde',5),
('Richard','Mendelsohn',5),
('Patrick','Michael Barney',5),
('Ali','Nahm',5),
('Ciara','Renee Newsome',5),
('Drew','Saunders',5),
('Will','Strober',5),
('Tejaswi','Baipa',22),
('CJ','Porter',22),
('Eloise','Schoener',22),
('Tam','Schoener',22),
('Will','Schoener',22),
('Zaya','Schoener',22),
('Derek','Shaffer',22),
('Emily','Shaffer',22),
('Noah','Shaffer',22),
('Oliver','Shaffer',22),
('Jessica','Blank',12),
('Naina','Chipalkatti',12),
('Kristina','Collins',12),
('Anna','Curtis',12),
('Alex','Dobner',12),
('Christian','Lamb',12),
('Megan','Opatrny',12),
('Erica','Talbot',12),
('Jason','Toy',12),
('Andrea','Bowers',4),
('Eli','Bowers',4),
('Stephen','Greene',4),
('Torianne','Greene',4),
('Fareedah','Haroun',4),
('Marie','Noel',4),
('Wendy','Nyugen',4),
('Breon','Wilson',4),
('Dianne','Wilson',4),
('Glenn','Conrad',18),
('Emily','Frank',18),
('Donald','Halpern',18),
('Andy','Kaufmann',18),
('Seetharaman','Krishnamoorthy',18),
('Ganapathy','Ramesh',18),
('Lee','Rodney',18),
('M.C.','Sankar',18)
      ON CONFLICT DO NOTHING;
  `;

  try {
    // Execute the query to create the table
    await pool.query(insertQuery);
    res.status(200).json({ message: 'Sample data inserted into seating table!' });
  } catch (err) {
    console.error('Error inserting sample data:', err);
    res.status(500).json({ error: 'Error inserting sample data: ' + err.message });
  }
});

// Insert Data endpoint
//app.get('/api/insert-data', async (req, res) => {
//  const insertQuery = `
//    INSERT INTO seating ("firstName", "lastName", "tableNumber")
//    VALUES 
//    ('Alice', 'Smith', 1),
//    ('Bob', 'Johnson', 2),
//    ('Charlie', 'Brown', 3)
//    ON CONFLICT DO NOTHING;
//  `;
//
//  try {
//    // Execute the query to create the table
//    await pool.query(insertQuery);
//    res.status(200).json({ message: 'Sample data inserted into seating table!' });
//  } catch (err) {
//    console.error('Error inserting sample data:', err);
//    res.status(500).json({ error: 'Error inserting sample data: ' + err.message });
//  }
//});

app.delete('/api/delete-data', async (req, res) => {
  try {
    const result = await pool.query(`
      DELETE FROM seating
      RETURNING *
    `);

    res.json({
      message: 'All records deleted successfully',
      deletedCount: result.rowCount
    });
  } catch (err) {
    console.error('Delete all query failed:', err);
    res.status(500).json({ error: 'Delete all query failed' });
  }
});

app.get('/api/dump-data', async (req, res) => {
  try {
    await pool.query(`TRUNCATE TABLE seating`);

    res.json({
      message: 'All records deleted successfully'
    });
  } catch (err) {
    console.error('Truncate failed:', err);
    res.status(500).json({ error: 'Truncate failed' });
  }
});

app.get('/api/new-data', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT "firstname", "lastname", "tablenumber"
      FROM seating
      ORDER BY "lastname" ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Search by Name
app.get('/api/people', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing name query parameter' });

  try {
    const result = await pool.query(`
      SELECT "firstname", "lastname", "tablenumber"
      FROM seating
      WHERE "firstname" ILIKE $1 OR "lastname" ILIKE $1
      ORDER BY "lastname" ASC
    `, [`%${name}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error('Database select query failed:', err);
    res.status(500).json({ error: 'Database select query failed' });
  }
});

// Search by Table
app.get('/api/table/:tableNumber', async (req, res) => {
  const tableNumber = parseInt(req.params.tableNumber, 10);
  if (isNaN(tableNumber)) return res.status(400).json({ error: 'Invalid table number' });

  try {
    const result = await pool.query(`
      SELECT "firstname", "lastname"
      FROM seating
      WHERE "tablenumber" = $1
      ORDER BY "lastname" ASC
    `, [tableNumber]);
    res.json(result.rows);
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
