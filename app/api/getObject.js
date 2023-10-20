import connectToDatabase from '../../db';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { objectId } = req.query;
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query('SELECT * FROM rezepte WHERE id = ?', [objectId]);
      const objectData = rows[0];

      res.status(200).json(objectData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the object.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
