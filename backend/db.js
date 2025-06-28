const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Andres2025#',
  database: 'proyectos'
});

module.exports = pool;