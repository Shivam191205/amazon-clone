const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 255 },
  password: { type: String, required: true, maxlength: 255 },
  phone: { type: String, default: null, maxlength: 20 },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

module.exports = mongoose.model('User', userSchema);
