// pages/api/getAmount.js

import { connectToDatabase, executeQuery, closeConnection } from '../../app/db.js';

export default async (req, res) => {
  const connection = await connectToDatabase();

  try {
    const sql = 'SELECT COUNT(ID) AS count FROM recipe';
    const rows = await executeQuery(connection, sql);

    if (rows.length !== 1) {
      res.status(204).json({ error: 'Error counting IDs. Multiple Results.' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the entry.' });
  } finally {
    closeConnection(connection);
  }
};
