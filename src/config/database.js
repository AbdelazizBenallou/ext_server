const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 100,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connection Success with Database');
    client.release();
  } catch (err) {
    console.error('❌ Connection failed with Database:', err.message);
    console.error('Connection details:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
  }
})();

module.exports = pool;
