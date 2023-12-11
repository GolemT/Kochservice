// pages/api/getObject.js

import { connectToDatabase, executeQuery, closeConnection } from '../../app/db.js';

export default async (req, res) => {
  const { objectId } = req.query;

  // Establish a database connection
  const connection = await connectToDatabase();

  try {
    // Execute the SQL query to retrieve the entry based on the provided ID
    const sql = 'SELECT * FROM recipe WHERE ID = ?';
    const params = [objectId];
    const rows = await executeQuery(connection, sql, params);

    if (rows.length === 0) {
      // If no matching entry is found, return a 404 response
      res.status(404).json({ error: 'Entry not found' });
    } else {
      // Return the found entry as JSON
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the entry.' });
  } finally {
    // Close the database connection
    closeConnection(connection);
  }
};
