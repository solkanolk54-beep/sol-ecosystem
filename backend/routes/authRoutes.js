/**
 * ==============================================================================
 * SOL ECOSYSTEM - Authentication Routes
 * File: backend/routes/authRoutes.js
 * ==============================================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public route: User login
router.post('/login', authController.login);

// Protected route: Current user profile
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;
