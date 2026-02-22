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
('Dinesh','Ambravaneswaran',2),
('Ramsankar','Ananthan',2),
('Sathappan','Annamalai',2),
('Robin','Applewood',2),
('Muthupriya','Arun',2),
('Dhanam','Aunty',2),
('Kalaiyarasan','B',2),
('Tejaswi','Baipa',2),
('Ajay','Bhargav',3),
('Priya','Bhargav',3),
('Darien','Blackwell',3),
('Andrea','Bowers',3),
('Eli','Bowers',3),
('Naomi','Bowers',3),
('Susan','Cann',3),
('Gordon','Cann',3),
('Hethirajan','Chakrapani',4),
('Jaisankar','Chakravarthy',4),
('Naina','Chipalkatti',4),
('Thenammai','Chockalingam',4),
('Kristina','Collins',4),
('Glenn','Conrad',4),
('Sam','Cronin',4),
('Anna','Curtis',4),
('Manikandan','Dhanuskodi',5),
('Ravi','Dinakaran',5),
('Kripa','Dinesh',5),
('Murugesan','Diraviam',5),
('Alex','Dobner',5),
('Ravi','Dudhalur',5),
('Emily','Frank',5),
('Yochana','Gavva',5),
('Shobha','Giridhar',6),
('Torianne','Greene',6),
('Stephen','Greene',6),
('Marie's','Guest',6),
('Krishna','Gurusamy',6),
('Donald','Halpern',6),
('Fareedah','Haroun',6),
('Ashwini','Hassija',6)
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