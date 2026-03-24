const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.postgresql://neondb_owner:npg_6BmY5QvwIUpa@ep-sweet-unit-a9p8s0bu-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB connection error:", err));

module.exports = pool;