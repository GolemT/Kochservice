// pages/api/getSearch.js

import { connectToDatabase, executeQuery, closeConnection } from '../../app/db.js';

export default async (req, res) => {
  const { input } = req.query;
  const searchValue = `%${input}%`;
  const connection = await connectToDatabase();

  try {
    const sql = 'SELECT ID, title, pic FROM recipe WHERE LOWER(title) LIKE LOWER(?) OR LOWER(ingredients) LIKE LOWER(?)';
    const params = [searchValue, searchValue];
    const rows = await executeQuery(connection, sql, params);

    if (rows.length === 0) {
      res.status(204).json({ error: 'No entries found.' });
    } else {
      res.status(200).json(rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the entries.' });
  } finally {
    closeConnection(connection);
  }
};
