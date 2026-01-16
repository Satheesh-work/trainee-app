require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('📡 Connected to MySQL server');

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
    console.log('\nNext steps:');
    console.log('1. npm run migrate:create create-users-table');
    console.log('2. npm run migrate:up');
    console.log('3. npm run dev');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();