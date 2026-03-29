const mongoose = require('mongoose');
require('dotenv').config();

const test = async () => {
  try {
    const uri = process.env.DATABASE_URL;
    console.log(`Testing Atlas connection to: ${uri.substring(0, 25)}...`);
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
};

test();
