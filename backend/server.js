/**
 * ==============================================================================
 * SOL ECOSYSTEM - Production-Ready Express.js Application Server
 * File: backend/server.js
 * Architecture: Clean MVC Pattern (Controllers, Routes, Models/Schema, Middleware, Config)
 * ==============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const treeRoutes = require('./routes/treeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const traceabilityRoutes = require('./routes/traceabilityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------------------------
// 1. CORE MIDDLEWARE
// ------------------------------------------------------------------------------
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL, '*'] : ['*'];
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers (Support Base64 image payloads for AI leaf scanner up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request Telemetry Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`);
  });
  next();
});

// ------------------------------------------------------------------------------
// 2. ROUTE MOUNTING (REST API)
// ------------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/traceability', traceabilityRoutes);

// Root & Health Verification
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const ping = await db.query('SELECT 1 AS ok');
    if (ping.rows.length > 0) dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'degraded_in_memory_fallback';
  }

  res.status(200).json({
    status: 'ONLINE',
    service: 'SOL Ecosystem AgriTech REST API',
    version: '1.0.0',
    region: 'Mila, Algeria',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// ------------------------------------------------------------------------------
// 3. 404 CATCH-ALL & GLOBAL ERROR HANDLER
// ------------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Resource endpoint '${req.originalUrl}' does not exist on this server.`
  });
});

app.use(errorHandler);

// ------------------------------------------------------------------------------
// 4. SERVER BOOTSTRAP
// ------------------------------------------------------------------------------
const startServer = async () => {
  // Test PostgreSQL Pool Connection
  await db.checkConnection();

  app.listen(PORT, () => {
    console.log('================================================================');
    console.log(`🌾 SOL Ecosystem Backend API online on port: ${PORT}`);
    console.log(`📍 Region: Mila Agro-Industrial Basin, Algeria`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log('================================================================');
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
