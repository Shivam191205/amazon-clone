/**
 * Amazon Clone - Backend Server
 * 
 * Express.js REST API server with MongoDB database via Mongoose.
 * Serves product, cart, order, and wishlist endpoints.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Amazon Clone API is running!', timestamp: new Date() });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// ============================================
// ERROR HANDLER (must be last)
// ============================================
app.use(errorHandler);

// ============================================
// CONNECT DB AND START SERVER
// ============================================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Amazon Clone API Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Health:     http://localhost:${PORT}/api/health`);
    console.log(`   Database:   MongoDB`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
});

module.exports = app;
