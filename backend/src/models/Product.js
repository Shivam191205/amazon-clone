const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 500 },
  description: { type: String, required: true },
  specifications: { type: String, default: null },
  price: { type: Number, required: true },
  original_price: { type: Number, default: null },
  stock: { type: Number, default: 0 },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  rating: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  is_prime: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', specifications: 'text' });

module.exports = mongoose.model('Product', productSchema);
