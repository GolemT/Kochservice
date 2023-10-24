const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001; // You can use any port you prefer

app.use(express.json());
app.use(cors());

// Database connection configuration
const dbConfig = {
  host: '127.0.0.1',
  user: 'user',
  password: 'user',
  database: 'kochservice', // database name
};

app.get('/', async (req, res) =>{
    res.status(200).json({ success: 'Backend online'})
})

app.get('/api/getObject', async (req, res) => {
  try {
    const { objectId } = req.query;

    // Connect to the database
    const connection = await mysql.createConnection(dbConfig);

    // Execute the SQL query to retrieve the entry based on the provided ID
    const [rows] = await connection.execute('SELECT * FROM recipe WHERE ID = ?', [objectId]);

    // Close the database connection
    await connection.end();

    if (rows.length === 0) {
      // If no matching entry is found, return a 404 response
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Return the found entry as JSON
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the entry.' });
  }
});

app.get('/api/getRecipes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const data = await connection.execute('SELECT * FROM recipe');

        await connection.end();

        if(!data){
            return res.status(404).json({ error: 'An error occured while fetchin the entry.'});
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error ocurred while fetching the entry.' })
    }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
