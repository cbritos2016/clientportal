require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); // Explicit path to .env
const sql = require('mssql');

// Log the config object before connecting
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // Default to 'db' since it’s the Docker service name
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
console.log('DB Config:', config);

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed:', err));

module.exports = {
  sql,
  poolPromise
};