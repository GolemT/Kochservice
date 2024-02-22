// pages/api/getRecipeNames.js

import { connectToDatabase, executeQuery, closeConnection } from '../../app/db.js';

export default async (req, res) => {
  const connection = await connectToDatabase();

  try {
    const sql = 'SELECT ID, title, pic FROM suggestion';
    const rows = await executeQuery(connection, sql);

    if (rows.length === 0) {
      res.status(200).json({ error: 'No Suggestion found.' });
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
