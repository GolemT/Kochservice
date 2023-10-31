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

app.get('/api/getRecipeNames', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute('SELECT ID, title, pic FROM recipe');

        await connection.end();

        if(rows.length === 0){
            return res.status(204).json({ error: 'No recipes found.'});
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error ocurred while fetching the entry.' })
    }
})

app.get('/api/getAmount', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute('SELECT COUNT(ID) AS count FROM recipe');

        await connection.end();

        if(!rows.length === 1){
            return res.status(204).json({ error: 'Error counting IDs. Multiple Results.'});
        }
        res.status(200).json(rows[0]);
  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error ocurred while fetching the entry.' })
  }  
})

app.get('/api/getSearch', async (req, res) => {
  try {
    const { input } = req.query
    const searchValue = `%${input}%`

    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`SELECT ID, title, pic FROM recipe WHERE LOWER(title) LIKE LOWER(?) OR LOWER(ingredients) LIKE LOWER(?)`, [searchValue, searchValue]);
    
    await connection.end();
    
    if(rows.length===0){
      return res.status(204).json({ error: 'No entries found.'})
    }
    
    res.status(200).json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error ocurred while fetching the entrys.'})
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
