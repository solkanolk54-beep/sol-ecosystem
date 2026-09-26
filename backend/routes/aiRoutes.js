/**
 * ==============================================================================
 * SOL ECOSYSTEM - AI Computer Vision Routes
 * File: backend/routes/aiRoutes.js
 * ==============================================================================
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/diagnose - Process leaf/fruit image and return treatment
router.post('/diagnose', aiController.diagnoseLeaf);

module.exports = router;
