const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, maxlength: 100 },
  image_url: { type: String, required: true, maxlength: 500 },
});

module.exports = mongoose.model('Category', categorySchema);
