const mysql = require('mysql2/promise');

async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'user',
    database: 'kochservice',
  });
  return connection;
}

module.exports = connectToDatabase;
