/**
 * Auth Middleware
 * 
 * Protects routes by verifying JWT tokens.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Token in Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_amazon_clone');

      // Get user from token
      const user = await User.findById(decoded.id).select('name email');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Attach user to request
      req.user = { id: user._id, name: user.name, email: user.email };
      next();
    } catch (error) {
      console.error('JWT Error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
