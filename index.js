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
('Patrick','Barney',5),
('Ali','Nahm',5),
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
('Marie','Gues',4),
('Breon','Wilson',4),
('Dianne','Wilson',4),
('Ciara','Newsome',4),
('Drew','Saunders',4),
('Ajay','Bhargav',18),
('Emily','Frank',18),
('Donald','Halpern',18),
('Andy','Kaufmann',18),
('Seetharaman','Krishnamoorthy',18),
('Ganapathy','Ramesh',18),
('Lee','Rodney',18),
('Priya','Bharav',18),
('Swaminathan','Balagopal',10),
('Rathi','Mahendran',10),
('Jothiharan','Mahenthiran',10),
('Vijayapriya','Meyyappan',10),
('Meyyappan','Narayanan',10),
('Anjali','Natarajan',10),
('Bala','Natarajan',10),
('Kannan','Natarajan',10),
('Lekshmi','Natarajan',10),
('Saradha','Natarajan',10),
('Deepa','Swaminathan',10),
('Muthappan','Alagappan',9),
('Arun','Meyyappan',9),
('Meena','Meyyappan',9),
('Nithya','Meyyappan',9),
('Sahana','Muthappan',9),
('Sudha','Muthappan',9),
('Chinta','Kasiraja',9),
('Meyyappan','Subramanian',9),
('Kasiraja','Sathappan',9),
('Kavya','Alagappan',15),
('Adai','Alagappan',15),
('Annamalai','Alagappan',15),
('Sathu','Alagappan',15),
('Chidambaram','Alagappan',15),
('Sangeetha','Payaniappa',15),
('Payaniappa','Venkatachalam',15),
('Alan','Thiruppathy',15),
('Shobha','Giridhar',8),
('Nalli','Manivannan',8),
('Arun','Periakaruppan',8),
('Manivannan','Periakaruppan',8),
('Priya','Periakaruppan',8),
('Giridhar','Singh',8),
('Praveena','Subbaraja',8),
('TA','Subbaraja',8),
('Meena','Kalyan',14),
('Rajesh','Ambat',14),
('Deepa','Rajesh',14),
('Ramya','Prabhakar',14),
('Kalyan','Sakthivelayutham',14),
('Prabhakar','Santhanam',14),
('Uma','Venkataraman',14),
('Venkat','Venkataraman',14),
('Ramsankar','Ananthan',11),
('Kalaiyarasan','B',11),
('Nelson','Joseph',11),
('Brinda','Kalaiyarasan',11),
('Pershia','Nelson',11),
('Pramod','Prabhu',11),
('Deepa','Pramod',11),
('Rahul','Pramod',11),
('Rohan','Pramod',11),
('Sudha','Ramsankar',11),
('Dhanam','Aunty',21),
('Sudhakar','Krishanan',21),
('Renuka','Sathya',21),
('Indira','Sudhakar',21),
('Sathya','Thulasiraman',21),
('Raghupathy','Uncle',21),
('Peter','Xavier',21),
('Sashi','Xavier',21),
('Meena','Kasi',2),
('Kasi','Krishnan',2),
('Manickam','Manickam',2),
('Meena','Manickam',2),
('Diya','Sampath',2),
('Meenu','Sampath',2),
('Sakthi','Sampath',2),
('Sam','Sundaresan',2),
('Yochana','Gavva',7),
('Aashil','Hassija',7),
('Ashwini','Hassija',7),
('Dheeraj','Kulshrestha',7),
('Suzanne','Kulshrestha',7),
('Satish','Nandyala',7),
('Dhaval','Patel',7),
('Leena','Sagar',7),
('Sagar','Supanekar',7),
('Murugappan','Alagappan',20),
('Jaisankar','Chakravarthy',20),
('Premsankar','Gopannan',20),
('Krishna','Jaisankar',20),
('Neela','Jaisankar',20),
('Viswa','Jaisankar',20),
('Revathi','Murugappan',20),
('Divya','Premsankar',20),
('Isai','Premsankar',20),
('Manikandan','Dhanuskodi',6),
('Murugesan','Diraviam',6),
('Raji','Kannan',6),
('Sriram','Kannan',6),
('Sudha','Manikandan',6),
('Ramanathan Meenatchi','Chockalingam',6),
('Nishant','Murugesan',6),
('Rajalakshmi','Murugesan',6),
('Meena','Ramanathan',6),
('Kannan','Thirunavukkarasu',6),
('Chockalingam','Adaikkappan',16),
('Sathappan','Annamalai',16),
('Thenammai','Chockalingam',16),
('Ravi','Dinakaran',16),
('Ravi','Dudhalur',16),
('Renjini','Krishnakumar',16),
('Krishnakumar','Padmanabhan',16),
('Gomathi','Ravi',16),
('Sridevi','Ravi',16),
('Latha','Sathappan',16),
('Dinesh','Ambravaneswaran',3),
('Kripa','Dinesh',3),
('Ravi','Krishnasamy',3),
('Kala','Manikanden',3),
('Muthuraman','Muthukaruppan',3),
('Meena','Muthuraman',3),
('Manikanden','Nagappan',3),
('Vadivu','Ravi',3),
('Muthupriya','Arun',3),
('Arun','Masan',3),
('Gomathi','Vishwanathan',19),
('Vishwanathan','Subramanian',19),
('Mani','Karuppiah',19),
('Nachammai','Mani',19),
('Alagu','Subbiah',19),
('Vinod','Subbiah',19),
('Subbiah','Subramanian',19),
('Anu','Vinod',19),
('Krishna','Gurusamy',13),
('Raja','Kannappan',13),
('Radika','Krishna',13),
('Shunmugaa','Laxmanan',13),
('Valli Priyanka','Nachiappan',13),
('Meena','Raja',13),
('Kalpana','Shunmugaa',13),
('Nachiappan','Subramanian',13),
('Senthil','Rajarathinam',13),
('Chithra','Senthil',13),
('Ramasamy','Kasiviswanathan',17),
('Chittal','Achi',17),
('Hethirajan','Chakrapani',17),
('Anaga','Hethirajan',17),
('Ramkumar','Venugopal',17),
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
