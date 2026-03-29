/**
 * Request Validation Middleware
 * 
 * Lightweight validation helpers without external libraries.
 * Validates required fields and data types for API requests.
 */

/**
 * Validates that required fields are present in the request body
 * @param {string[]} fields - Array of required field names
 */
const requireFields = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }
    next();
  };
};

/**
 * Validates that a URL parameter is a valid positive integer
 * @param {string} paramName - Name of the URL parameter to validate
 */
const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = parseInt(req.params[paramName], 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}: must be a positive integer`,
      });
    }
    req.params[paramName] = id;
    next();
  };
};

/**
 * Validates quantity is a positive integer
 */
const validateQuantity = (req, res, next) => {
  const { quantity } = req.body;
  if (quantity !== undefined) {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
      });
    }
    req.body.quantity = qty;
  }
  next();
};

module.exports = { requireFields, validateId, validateQuantity };
