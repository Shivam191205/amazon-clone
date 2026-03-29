const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  image_url: { type: String, required: true, maxlength: 500 },
  is_primary: { type: Boolean, default: false },
  sort_order: { type: Number, default: 0 },
});

module.exports = mongoose.model('ProductImage', productImageSchema);
