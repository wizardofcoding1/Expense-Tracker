import pg from "pg";
import config from "../config/config.js"
const {Pool} = pg;

// Parse NUMERIC (1700) as float
pg.types.setTypeParser(1700, (val) => parseFloat(val));

// Parse DATE (1082) as a raw string format (YYYY-MM-DD) instead of local Date
pg.types.setTypeParser(1082, (val) => val);


const pool = new Pool({
      connectionString: config.DATABASE_URL,
      ssl:{
            rejectUnauthorized: false,
      },
});

// Auto-initialize sessions table
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        token_id VARCHAR(255) NOT NULL UNIQUE,
        device_name VARCHAR(255),
        browser VARCHAR(255),
        os VARCHAR(255),
        ip_address VARCHAR(255),
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database user_sessions table initialized.");
  } catch (err) {
    console.error("Database user_sessions table initialization failed:", err.message || err);
  }
};
initDb();

// Handle idle connection errors gracefully (prevents ECONNRESET from crashing node)
pool.on('error', (err) => {
      console.error('Unexpected error on idle pg client:', err.message || err);
});

export default pool;