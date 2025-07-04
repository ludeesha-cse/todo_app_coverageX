require('dotenv').config();
const app = require('./app');
const pool = require('./utils/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Connected to MySQL DB');
    conn.release(); // release the connection back to pool
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1); // stop the app if DB is not connected
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
