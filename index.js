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
('Aashil','Hassija',7),
('Anaga','Hethirajan',7),
('Megan','Houlihan',7),
('Neela','Jaisankar',7),
('Viswa','Jaisankar',7),
('Krishna','Jaisankar',7),
('Nelson','Joseph',7),
('Brinda','Kalaiyarasan',7),
('Meena','Kalyan',8),
('Raji','Kannan',8),
('Sriram','Kannan',8),
('Raja','Kannappan',8),
('Mani','Karuppiah',8),
('Meena','Kasi',8),
('Ramasamy','Kasiviswanathan',8),
('Sudhakar','Krishanan',8),
('Radika','Krishna',9),
('Renjini','Krishnakumar',9),
('Seetharaman','Krishnamoorthy',9),
('Rajesh','Krishnamurthy',9),
('Kasi','Krishnan',9),
('Ravi','Krishnasamy',9),
('Shanmugam','Lakshmanan',9),
('Alamu','Lakshmanan',9),
('Geoffrey','Lalonde',10),
('Christian','Lamb',10),
('Shunmugaa','Laxmanan',10),
('Vanessa','Lord',10),
('Rathi','Mahendran',10),
('Jothiharan','Mahenthiran',10),
('Nachammai','Mani',10),
('Manickam','Manickam',10),
('Meena','Manickam',11),
('Sudha','Manikandan',11),
('Kala','Manikanden',11),
('Nalli','Manivannan',11),
('Arun','Masan',11),
('Ramanathan','Meenatchi Chockalingam',11),
('Meena','Meyyappan',11),
('Nithya','Meyyappan',11),
('Arun','Meyyappan',12),
('Patrick','Michael Barney',12),
('Revathi','Murugappan',12),
('Rajalakshmi','Murugesan',12),
('Nishant','Murugesan',12),
('Sudha','Muthappan',12),
('Sahana','Muthappan',12),
('Muthuraman','Muthukaruppan',12)
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