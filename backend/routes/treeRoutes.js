/**
 * ==============================================================================
 * SOL ECOSYSTEM - Smart Orchard & Trees Routes
 * File: backend/routes/treeRoutes.js
 * ==============================================================================
 */

const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');

// GET /api/trees - Filter by healthStatus, species, variety, search
router.get('/', treeController.getTrees);

// GET /api/trees/:id - Detailed tree profile with health history
router.get('/:id', treeController.getTreeById);

module.exports = router;
