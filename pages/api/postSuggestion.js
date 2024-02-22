// pages/api/postRecipe.js

import { connectToDatabase, executeQuery, closeConnection } from '../../app/db.js';

export default async (req, res) => {
  console.log('API received a request');

  const { name, pic, ingredients, steps } = req.body; // Use req.body to access the JSON data

  const connection = await connectToDatabase();

  try {
    console.log('Received data:', req.body);

    //Create a new entry within the suggestion table

    const sql = 'INSERT INTO `suggestion` (`title`, `pic`, `ingredients`, `preparation`) VALUES (?, ?, ?, ?)';
    const params = [name, pic, ingredients, steps];

    await executeQuery(connection, sql, params);

    res.status(200).json({ success: 'Recipe added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the entries.' });
  } finally {
    closeConnection(connection);
  }
};
