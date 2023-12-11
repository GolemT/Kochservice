// pages/api/postRecipe.js

import { connectToDatabase, executeQuery, closeConnection } from '../../app/db.js';

export default async (req, res) => {
  const { data } = req.query;
  const connection = await connectToDatabase();

  try {
    // Extract data properties as needed (e.g., data.title, data.pic, data.ingredients, data.preparation)
    const { title, pic, ingredients, preparation } = data;

    const sql = 'INSERT INTO `recipe` (`title`, `pic`, `ingredients`, `preparation`) VALUES (?, ?, ?, ?)';
    const params = [title, pic, ingredients, preparation];

    await executeQuery(connection, sql, params);

    res.status(200).json({ success: 'Recipe added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the entries.' });
  } finally {
    closeConnection(connection);
  }
};
