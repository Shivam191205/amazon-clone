const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'confirmed', maxlength: 50 },
  shipping_name: { type: String, required: true, maxlength: 100 },
  shipping_address: { type: String, required: true, maxlength: 500 },
  shipping_city: { type: String, required: true, maxlength: 100 },
  shipping_state: { type: String, required: true, maxlength: 100 },
  shipping_zip: { type: String, required: true, maxlength: 20 },
  shipping_phone: { type: String, required: true, maxlength: 20 },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

module.exports = mongoose.model('Order', orderSchema);
