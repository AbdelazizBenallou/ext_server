const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',       // For PostgreSQL
    logging: false,            // Disable logging for production
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
})();

module.exports = sequelize;
