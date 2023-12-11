// db.js

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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
