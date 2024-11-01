// database.js
const { Pool } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Volvemos a usar database-ana
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
};

const pool = new Pool(config);

// Manejador de errores del pool
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de postgres:', err);
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexión exitosa a la base de datos');
    const result = await client.query('SELECT NOW()');
    console.log('Consulta de prueba:', result.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    console.error('Detalles:', err.stack);
  }
};

testConnection();

module.exports = {
  pool
};