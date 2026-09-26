/**
 * ==============================================================================
 * SOL ECOSYSTEM - Authentication & Authorization Middleware
 * File: backend/middleware/auth.js
 * ==============================================================================
 */

const jwt = require('jsonwebtoken');

/**
 * Validates the JWT in Authorization header: "Bearer <token>"
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: 'Access denied. Missing Authorization Bearer token.'
    });
  }

  const secret = process.env.JWT_SECRET || 'sol_ecosystem_super_secure_jwt_secret_2026_change_in_production';

  jwt.verify(token, secret, (err, decodedUser) => {
    if (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: isExpired ? 'Access token has expired.' : 'Access token is invalid.'
      });
    }

    req.user = decodedUser;
    next();
  });
};

/**
 * Role-Based Access Control (RBAC) middleware generator
 * @param  {...string} allowedRoles - e.g. 'admin', 'farm_manager', 'agronomist'
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `User role '${req.user?.role || 'anonymous'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
