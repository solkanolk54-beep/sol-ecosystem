/**
 * ==============================================================================
 * SOL ECOSYSTEM - Farms Routes
 * File: backend/routes/farmRoutes.js
 * ==============================================================================
 */

const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');

// GET /api/farms - List all holdings
router.get('/', farmController.getAllFarms);

// GET /api/farms/:id - Get holding with aggregated telemetry
router.get('/:id', farmController.getFarmById);

module.exports = router;
