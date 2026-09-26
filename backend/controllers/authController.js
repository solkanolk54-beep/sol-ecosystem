/**
 * ==============================================================================
 * SOL ECOSYSTEM - Authentication Controller
 * File: backend/controllers/authController.js
 * ==============================================================================
 */

const jwt = require('jsonwebtoken');
const db = require('../config/db');

// In-Memory Seed Users for resilient local sandbox fallback
const FALLBACK_USERS = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    email: 'admin@solecosystem.agri',
    password: 'password123',
    fullName: 'Karim Benali',
    phone: '+213 550 123 456',
    role: 'admin'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    email: 'manager.mila@solecosystem.agri',
    password: 'password123',
    fullName: 'Dr. Amine Mansouri',
    phone: '+213 661 789 012',
    role: 'farm_manager'
  }
];

/**
 * POST /api/auth/login
 * Authenticates user credentials and generates signed JWT bearer token.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Both email and password are required fields.'
      });
    }

    let user = null;

    try {
      // Query PostgreSQL
      const userResult = await db.query(
        'SELECT id, email, password_hash, full_name, phone, role, is_active FROM users WHERE email = $1 LIMIT 1',
        [email.toLowerCase().trim()]
      );
      if (userResult.rows.length > 0) {
        user = userResult.rows[0];
      }
    } catch (dbErr) {
      console.warn('⚠️ [Auth DB Query Failed, falling back to in-memory store]:', dbErr.message);
    }

    // In-memory fallback if DB not active or user not in DB
    if (!user) {
      user = FALLBACK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (user && user.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid email or password credentials.'
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password credentials. (Test accounts: manager.mila@solecosystem.agri / password123)'
      });
    }

    // Sign JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'sol_ecosystem_super_secure_jwt_secret_2026_change_in_production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const tokenPayload = {
      id: user.id,
      email: user.email,
      fullName: user.full_name || user.fullName,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || user.fullName,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getProfile
};
