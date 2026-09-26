/**
 * ==============================================================================
 * SOL ECOSYSTEM - Database Configuration & PostgreSQL Connection Pool
 * File: backend/config/db.js
 * ==============================================================================
 */

const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'sol_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '5000', 10),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

// Event listeners for pool lifecycle monitoring
pool.on('connect', (client) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('📦 [PostgreSQL Pool] New client acquired connection from pool');
  }
});

pool.on('error', (err, client) => {
  console.error('🔥 [PostgreSQL Pool Error] Unexpected error on idle client:', err.message);
});

/**
 * Executes a parameterized SQL query on the pool.
 * @param {string} text - SQL query string
 * @param {Array} params - Parameter bindings
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ [SQL Query Executed] ${duration}ms | Rows: ${res.rowCount}`);
    }
    return res;
  } catch (error) {
    console.error('❌ [SQL Execution Error]:', error.message);
    throw error;
  }
};

/**
 * Checks database connectivity.
 */
const checkConnection = async () => {
  try {
    const res = await query('SELECT NOW() AS current_db_time, version() AS pg_version');
    console.log(`✅ [PostgreSQL Connected] Server Time: ${res.rows[0].current_db_time}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [PostgreSQL Offline/Standby] Error: ${error.message}. API running with fallback in-memory capability.`);
    return false;
  }
};

module.exports = {
  pool,
  query,
  checkConnection
};
