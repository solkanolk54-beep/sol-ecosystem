/**
 * ==============================================================================
 * SOL ECOSYSTEM - Traceability & Passport Routes
 * File: backend/routes/traceabilityRoutes.js
 * ==============================================================================
 */

const express = require('express');
const router = express.Router();
const traceabilityController = require('../controllers/traceabilityController');

// Public route: Consumer passport scan
router.get('/public/:batchCode', traceabilityController.getPublicBatchPassport);

// Internal route: All batches
router.get('/batches', traceabilityController.listBatches);

module.exports = router;
