// db.js

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  host: 'q42.h.filess.io',
  user: 'Kochservice_secondsave',
  password: '512e33c9bd6dea412fb8471eb338b82163849340',
  database: 'Kochservice_secondsave',
  port: 3305,
};

// Function to establish a database connection
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    throw new Error(`Failed to connect to the database: ${error.message}`);
  }
}

// Function to execute a query and return results
async function executeQuery(connection, sql, params) {
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

// Function to close the database connection
async function closeConnection(connection) {
  try {
    await connection.end();
  } catch (error) {
    console.error(`Failed to close the database connection: ${error.message}`);
  }
}

module.exports = {
  connectToDatabase,
  executeQuery,
  closeConnection,
};
