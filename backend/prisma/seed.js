/**
 * Database Seed Script (MongoDB/Mongoose)
 * 
 * Seeds the MongoDB database with:
 * - 1 default user
 * - 6 product categories
 * - 50+ products with realistic data across all categories
 * - Multiple images per product
 * - Existing user data from PostgreSQL dump
 * 
 * Run: npm run db:seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const ProductImage = require('../src/models/ProductImage');
const CartItem = require('../src/models/CartItem');
const Order = require('../src/models/Order');
const OrderItem = require('../src/models/OrderItem');
const WishlistItem = require('../src/models/WishlistItem');
const Review = require('../src/models/Review');

async function main() {
  console.log('🌱 Starting MongoDB seed...\n');

  await mongoose.connect(process.env.DATABASE_URL);
  console.log('✅ Connected to MongoDB\n');

  // Drop existing data
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    ProductImage.deleteMany({}),
    CartItem.deleteMany({}),
    Order.deleteMany({}),
    OrderItem.deleteMany({}),
    WishlistItem.deleteMany({}),
    Review.deleteMany({}),
  ]);

  // ============================================
  // 1. Create users (from existing data dump)
  // ============================================
  const usersData = [
    { name: 'Default User', email: 'default@amazon-clone.com', password: await bcrypt.hash('password123', 12) },
    { name: 'shivam', email: 'shivamnagpal603@gmail.com', password: await bcrypt.hash('password123', 12) },
    { name: 'shivam', email: 'shivamnagpalch@gmail.com', password: await bcrypt.hash('password123', 12) },
    { name: 'Raj', email: 'soco92297@gmail.com', password: await bcrypt.hash('password123', 12) },
  ];

  const users = await User.insertMany(usersData);
  const userMap = {};
  users.forEach(u => { userMap[u.email] = u._id; });
  console.log(`✅ Created ${users.length} users`);

  // ============================================
  // 2. Create categories
  // ============================================
  const categoryData = [
    { name: 'Electronics', slug: 'electronics', image_url: 'https://m.media-amazon.com/images/I/61Kpx9+A8TL._AC_SL1500_.jpg' },
    { name: 'Books', slug: 'books', image_url: 'https://m.media-amazon.com/images/I/71N6i9p7yCL._SL1500_.jpg' },
    { name: 'Clothing', slug: 'clothing', image_url: 'https://m.media-amazon.com/images/I/71uV2v2eWBL._AC_UX569_.jpg' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', image_url: 'https://m.media-amazon.com/images/I/81xG-Y-u3IL._AC_SL1500_.jpg' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', image_url: 'https://m.media-amazon.com/images/I/516T9C+S-6L._AC_SL1500_.jpg' },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', image_url: 'https://m.media-amazon.com/images/I/61S4h1-4P+L._AC_SL1500_.jpg' },
  ];

  const categories = await Category.insertMany(categoryData);
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c._id; });
  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // 3. Create products with images
  // ============================================
  const products = [
    // ---- ELECTRONICS (12 products) ----
    {
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      description: 'Experience industry-leading noise cancellation technology that revolutionizes how you listen to music. The Sony WH-1000XM5 headphones feature the integrated Processor V1 that unlocks the full potential of our HD Noise Cancelling Processor QN1. This combination delivers unmatched audio quality, completely immersing you in high-fidelity sound. Designed with ultra-comfortable lightweight materials, these headphones provide all-day comfort without pressure. Enjoy crystal clear hands-free calling backed by precise voice pickup and advanced audio signal processing. The battery lasts an exceptional 30 hours, ensuring you always have power during long flights or commutes. Quick charging adds 3 hours of playback with just a 3-minute charge.',
      specifications: JSON.stringify({ Brand: 'Sony', Model: 'WH-1000XM5', Color: 'Black', Connectivity: 'Bluetooth 5.2', Battery: '30 hours', Weight: '250g', 'Noise Cancellation': 'Yes - Adaptive' }),
      price: 28884, original_price: 33199, stock: 45, categorySlug: 'electronics', rating: 4.7, review_count: 12453, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/61Kpx9+A8TL._AC_SL1500_.jpg', primary: true },
        { url: 'https://m.media-amazon.com/images/I/51r5I9A420L._AC_SL1500_.jpg', primary: false },
      ],
    },
    {
      name: 'Apple MacBook Air M3 Chip 15-inch Laptop',
      description: 'Supercharged by the groundbreaking M3 chip, the new 15-inch MacBook Air is an exceptionally thin, light, and hyper-fast portable powerhouse. Featuring a breathtaking 15.3-inch Liquid Retina display with over 500 nits of brightness and P3 wide color, images pop with brilliant realism. The M3 processor combines an 8-core CPU with up to a 10-core GPU, providing accelerated performance for everything from daily productivity to intense graphical editing workloads.',
      specifications: JSON.stringify({ Brand: 'Apple', Processor: 'M3 chip', RAM: '8GB', Storage: '256GB SSD', Display: '15.3" Liquid Retina', Battery: '18 hours', Weight: '1.51 kg' }),
      price: 103667, original_price: 107817, stock: 23, categorySlug: 'electronics', rating: 4.8, review_count: 8765, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg', primary: true },
        { url: 'https://m.media-amazon.com/images/I/61mZkUp3WDL._AC_SL1500_.jpg', primary: false },
      ],
    },
    {
      name: 'Asus ROG Strix G16 Gaming Laptop',
      description: 'Power your competitive edge and draw more frames per second with the brand new Strix G16. Armed to the teeth with the latest Intel Core i9 processor and an NVIDIA GeForce RTX 4070 Laptop GPU.',
      specifications: JSON.stringify({ Brand: 'ASUS', Processor: 'Intel Core i9', RAM: '16GB DDR5', Storage: '1TB SSD', GPU: 'RTX 4070', Display: '16" 165Hz' }),
      price: 116199, original_price: 128649, stock: 12, categorySlug: 'electronics', rating: 4.6, review_count: 1450, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Google Pixel 8 Pro 128GB',
      description: 'Meet the meticulously crafted Pixel 8 Pro, completely reimagined inside and out. Powered by the all-new Tensor G3 chip. With advanced AI features baked directly into its software.',
      specifications: JSON.stringify({ Brand: 'Google', Model: 'Pixel 8 Pro', Storage: '128GB', RAM: '12GB', Display: '6.7" LTPO OLED', Camera: '50MP', Battery: '5050mAh' }),
      price: 82917, original_price: 91217, stock: 45, categorySlug: 'electronics', rating: 4.8, review_count: 5200, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra 256GB Smartphone',
      description: 'Galaxy AI is here. Search like never before. 200MP camera, S Pen included, titanium frame, 6.8" QHD+ Dynamic AMOLED display with 120Hz refresh rate.',
      specifications: JSON.stringify({ Brand: 'Samsung', Model: 'Galaxy S24 Ultra', Storage: '256GB', RAM: '12GB', Display: '6.8" QHD+ AMOLED', Camera: '200MP', Battery: '5000mAh' }),
      price: 99599, original_price: 117859, stock: 34, categorySlug: 'electronics', rating: 4.6, review_count: 15432, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/71RVuS3q9ML._AC_SL1500_.jpg', primary: true },
        { url: 'https://m.media-amazon.com/images/I/71ZdySToJSL._AC_SL1500_.jpg', primary: false },
      ],
    },
    {
      name: 'JBL Charge 5 Portable Bluetooth Speaker',
      description: 'JBL Charge 5 speaker delivers bold JBL Original Pro Sound. Up to 20 hours of playtime, IP67 waterproof and dustproof.',
      specifications: JSON.stringify({ Brand: 'JBL', Model: 'Charge 5', 'Battery Life': '20 hours', Waterproof: 'IP67', Bluetooth: '5.1', Weight: '960g' }),
      price: 12446, original_price: 14936, stock: 78, categorySlug: 'electronics', rating: 4.7, review_count: 23456, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Logitech MX Master 3S Wireless Mouse',
      description: 'Advanced wireless mouse with ultra-fast MagSpeed scroll wheel, ergonomic design, 8K DPI tracking.',
      specifications: JSON.stringify({ Brand: 'Logitech', Model: 'MX Master 3S', DPI: '8000', Connectivity: 'Bluetooth, USB receiver', Battery: '70 days', Weight: '141g' }),
      price: 7469, original_price: 8299, stock: 120, categorySlug: 'electronics', rating: 4.8, review_count: 9876, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Apple iPad Air 11-inch M2 Chip 128GB',
      description: 'The new iPad Air with M2 chip. 11-inch Liquid Retina display, 12MP front camera with Center Stage.',
      specifications: JSON.stringify({ Brand: 'Apple', Chip: 'M2', Display: '11" Liquid Retina', Storage: '128GB', Camera: '12MP', Weight: '462g' }),
      price: 49717, original_price: null, stock: 56, categorySlug: 'electronics', rating: 4.8, review_count: 5678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Canon EOS R50 Mirrorless Camera with 18-45mm Lens',
      description: 'Compact and lightweight mirrorless camera with 24.2MP APS-C sensor, 4K video recording.',
      specifications: JSON.stringify({ Brand: 'Canon', Model: 'EOS R50', Sensor: '24.2MP APS-C', Video: '4K 30fps', Display: '3" Vari-angle', Weight: '375g' }),
      price: 56439, original_price: 66399, stock: 19, categorySlug: 'electronics', rating: 4.5, review_count: 3456, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Amazon Echo Dot 5th Gen Smart Speaker with Alexa',
      description: 'Our best sounding Echo Dot yet. Enjoy an improved audio experience with clearer vocals, deeper bass.',
      specifications: JSON.stringify({ Brand: 'Amazon', Model: 'Echo Dot 5th Gen', Speaker: '1.73" driver', Connectivity: 'Wi-Fi, Bluetooth', Assistant: 'Alexa' }),
      price: 2323, original_price: 4149, stock: 200, categorySlug: 'electronics', rating: 4.6, review_count: 45678, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/61Kpx9+A8TL._AC_SL1000_.jpg', primary: true },
      ],
    },
    {
      name: 'Samsung 55" Crystal 4K UHD Smart TV',
      description: 'Crystal Processor 4K delivers a crystal clear, naturally vivid picture.',
      specifications: JSON.stringify({ Brand: 'Samsung', Size: '55 inches', Resolution: '4K UHD', HDR: 'HDR10+', 'Smart TV': 'Tizen OS' }),
      price: 28883, original_price: 43989, stock: 15, categorySlug: 'electronics', rating: 4.5, review_count: 18765, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Anker 20000mAh Portable Power Bank USB-C',
      description: 'High-capacity 20000mAh portable charger with 20W USB-C fast charging.',
      specifications: JSON.stringify({ Brand: 'Anker', Capacity: '20000mAh', Output: '20W USB-C', Ports: 'USB-C + USB-A', Weight: '340g' }),
      price: 2987, original_price: 3817, stock: 150, categorySlug: 'electronics', rating: 4.7, review_count: 34567, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- BOOKS (9 products) ----
    {
      name: 'Atomic Habits by James Clear',
      description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      specifications: JSON.stringify({ Author: 'James Clear', Format: 'Hardcover', Pages: 320, Publisher: 'Avery' }),
      price: 1161, original_price: 2241, stock: 339, categorySlug: 'books', rating: 4.9, review_count: 105670, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'The Psychology of Money by Morgan Housel',
      description: 'Timeless lessons on wealth, greed, and happiness. Morgan Housel shares 19 short stories exploring the strange ways people think about money.',
      specifications: JSON.stringify({ Author: 'Morgan Housel', Pages: 256, Publisher: 'Harriman House', Format: 'Paperback' }),
      price: 1244, original_price: 1576, stock: 230, categorySlug: 'books', rating: 4.7, review_count: 67890, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Clean Code by Robert C. Martin',
      description: 'A Handbook of Agile Software Craftsmanship. A must-read for every developer.',
      specifications: JSON.stringify({ Author: 'Robert C. Martin', Pages: 464, Publisher: 'Prentice Hall', Format: 'Paperback' }),
      price: 2780, original_price: 4149, stock: 89, categorySlug: 'books', rating: 4.6, review_count: 12345, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Sapiens: A Brief History of Humankind',
      description: 'From a renowned historian comes a groundbreaking narrative of humanity creation and evolution.',
      specifications: JSON.stringify({ Author: 'Yuval Noah Harari', Pages: 464, Publisher: 'Harper Perennial', Format: 'Paperback' }),
      price: 1286, original_price: 1908, stock: 156, categorySlug: 'books', rating: 4.6, review_count: 87654, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Thinking, Fast and Slow by Daniel Kahneman',
      description: 'Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
      specifications: JSON.stringify({ Author: 'Daniel Kahneman', Pages: 499, Publisher: 'Farrar, Straus and Giroux', Format: 'Paperback' }),
      price: 995, original_price: 1577, stock: 178, categorySlug: 'books', rating: 4.6, review_count: 54321, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'The Pragmatic Programmer 20th Anniversary Edition',
      description: 'Your journey to mastery. Classic guide covers everything from personal responsibility and career development to architectural techniques.',
      specifications: JSON.stringify({ Author: 'David Thomas, Andrew Hunt', Pages: 352, Publisher: 'Addison-Wesley', Format: 'Hardcover' }),
      price: 3278, original_price: 4979, stock: 67, categorySlug: 'books', rating: 4.7, review_count: 8765, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Deep Work by Cal Newport',
      description: 'Rules for Focused Success in a Distracted World.',
      specifications: JSON.stringify({ Author: 'Cal Newport', Pages: 304, Publisher: 'Grand Central Publishing', Format: 'Paperback' }),
      price: 1037, original_price: 1494, stock: 198, categorySlug: 'books', rating: 4.6, review_count: 23456, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Dune by Frank Herbert - Paperback',
      description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.',
      specifications: JSON.stringify({ Author: 'Frank Herbert', Pages: 688, Publisher: 'Ace', Format: 'Paperback' }),
      price: 912, original_price: 1576, stock: 256, categorySlug: 'books', rating: 4.7, review_count: 45678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'System Design Interview by Alex Xu',
      description: 'An insider guide covering system design interview questions with step-by-step guides.',
      specifications: JSON.stringify({ Author: 'Alex Xu', Pages: 320, Publisher: 'Byte Code LLC', Format: 'Paperback' }),
      price: 2489, original_price: 3319, stock: 123, categorySlug: 'books', rating: 4.5, review_count: 12345, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/71N6i9p7yCL._SL1500_.jpg', primary: true },
      ],
    },

    // ---- CLOTHING (9 products) ----
    {
      name: "Levi's Men's 511 Slim Fit Jeans",
      description: "The definitive silhouette for modern styling. The Levi's 511 Slim Fit Jeans perfectly fuse a tailored slim profile with functional movement space.",
      specifications: JSON.stringify({ Brand: "Levi's", Material: '99% Cotton, 1% Elastane', Fit: 'Slim', Closure: 'Zipper' }),
      price: 4939, original_price: 5769, stock: 89, categorySlug: 'clothing', rating: 4.4, review_count: 15432, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Nike Air Max 270 Running Shoes',
      description: "Nike's first lifestyle Air Max brings you style, comfort, and big attitude with the biggest heel Air unit yet.",
      specifications: JSON.stringify({ Brand: 'Nike', Model: 'Air Max 270', Material: 'Synthetic and Mesh', Type: 'Running Shoes' }),
      price: 12450, original_price: 13280, stock: 44, categorySlug: 'clothing', rating: 4.5, review_count: 23456, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Adidas Essentials French Terry 3-Stripes Hoodie',
      description: 'An indisputable athleisure classic. This Adidas hoodie is spun from exceptionally soft 100% French terry cotton fabric.',
      specifications: JSON.stringify({ Brand: 'Adidas', Material: '100% Cotton French Terry', Style: 'Hooded', Padding: 'None' }),
      price: 3735, original_price: 4565, stock: 120, categorySlug: 'clothing', rating: 4.6, review_count: 12345, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Ray-Ban Aviator Classic Sunglasses',
      description: 'The iconic Ray-Ban Aviator sunglasses. Originally designed for U.S. aviators in 1937.',
      specifications: JSON.stringify({ Brand: 'Ray-Ban', Model: 'RB3025', Frame: 'Gold Metal', Lens: 'Crystal Green', Protection: 'UV400' }),
      price: 13363, original_price: 15106, stock: 43, categorySlug: 'clothing', rating: 4.7, review_count: 34567, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Adidas Ultraboost Light Running Shoes - Women',
      description: 'Experience epic energy with Light BOOST cushioning. 30% lighter BOOST midsole.',
      specifications: JSON.stringify({ Brand: 'Adidas', Model: 'Ultraboost Light', Material: 'Primeknit upper', Sole: 'Continental Rubber' }),
      price: 11619, original_price: 15770, stock: 54, categorySlug: 'clothing', rating: 4.6, review_count: 8765, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Columbia Watertight II Rain Jacket - Men',
      description: 'Stay dry in the rain with this lightweight, packable rain jacket.',
      specifications: JSON.stringify({ Brand: 'Columbia', Material: 'Nylon', Waterproof: 'Omni-Tech', Fit: 'Modern Classic' }),
      price: 4149, original_price: 7470, stock: 87, categorySlug: 'clothing', rating: 4.5, review_count: 15678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Calvin Klein Classic Fit Dress Shirt - Men',
      description: 'A sophisticated dress shirt featuring a classic fit, point collar. Wrinkle-free performance fabric.',
      specifications: JSON.stringify({ Brand: 'Calvin Klein', Material: '100% Cotton', Fit: 'Classic', Collar: 'Point' }),
      price: 2489, original_price: 4109, stock: 134, categorySlug: 'clothing', rating: 4.4, review_count: 7654, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Herschel Supply Co. Classic Backpack',
      description: 'A reimagined everyday essential with large main compartment and 15" laptop sleeve.',
      specifications: JSON.stringify({ Brand: 'Herschel', Volume: '24L', Material: 'Polyester', Laptop: '15"' }),
      price: 3319, original_price: 4564, stock: 98, categorySlug: 'clothing', rating: 4.6, review_count: 23456, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Casio G-Shock Digital Watch - Black',
      description: 'The legendary G-Shock. Shock-resistant, 200m water resistance, LED backlight.',
      specifications: JSON.stringify({ Brand: 'Casio', Model: 'DW5600E-1V', 'Water Resistance': '200m', Display: 'Digital' }),
      price: 3519, original_price: 5806, stock: 167, categorySlug: 'clothing', rating: 4.7, review_count: 45678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- HOME & KITCHEN (9 products) ----
    {
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
      description: '7-in-1 functionality: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
      specifications: JSON.stringify({ Brand: 'Instant Pot', Model: 'Duo', Capacity: '6 Quart', Programs: '13 One-Touch' }),
      price: 6636, original_price: 8296, stock: 156, categorySlug: 'home-kitchen', rating: 4.7, review_count: 156789, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Keurig K-Elite Coffee Maker',
      description: 'Brew your perfect cup with 5 brew sizes, strong brew button, iced setting, and a 75oz water reservoir.',
      specifications: JSON.stringify({ Brand: 'Keurig', Type: 'Single Serve', 'Reservoir Size': '75 oz', Features: 'Iced Setting, Strong Brew' }),
      price: 12367, original_price: 15769, stock: 34, categorySlug: 'home-kitchen', rating: 4.7, review_count: 12345, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'iRobot Roomba 694 Robot Vacuum',
      description: 'Wi-Fi connected robot vacuum that cleans on your schedule.',
      specifications: JSON.stringify({ Brand: 'iRobot', Model: 'Roomba 694', Runtime: '90 min', Navigation: 'iAdapt' }),
      price: 14939, original_price: 22824, stock: 34, categorySlug: 'home-kitchen', rating: 4.4, review_count: 45678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Ninja Professional Plus Blender 1400W',
      description: 'Professional performance with Total Crushing Technology. 72oz pitcher.',
      specifications: JSON.stringify({ Brand: 'Ninja', Power: '1400W', Capacity: '72oz', Blades: 'Stacked Blade' }),
      price: 6639, original_price: 9959, stock: 89, categorySlug: 'home-kitchen', rating: 4.7, review_count: 34567, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'AmazonBasics 18-Piece Dinnerware Set',
      description: 'Complete dinnerware set for 6 people. Made of durable AB-grade porcelain.',
      specifications: JSON.stringify({ Brand: 'AmazonBasics', Pieces: 18, Material: 'AB-Grade Porcelain', 'Service For': 6 }),
      price: 2987, original_price: 3983, stock: 178, categorySlug: 'home-kitchen', rating: 4.5, review_count: 12345, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Lodge 10.25-inch Pre-Seasoned Cast Iron Skillet',
      description: 'A timeless kitchen essential. Pre-seasoned with 100% vegetable oil.',
      specifications: JSON.stringify({ Brand: 'Lodge', Size: '10.25 inches', Material: 'Cast Iron', Made: 'USA' }),
      price: 1652, original_price: 2904, stock: 245, categorySlug: 'home-kitchen', rating: 4.7, review_count: 87654, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'COSORI Air Fryer Pro II 5.8Qt',
      description: 'Cook your favorite fried foods with up to 85% less fat. 12 one-touch cooking functions.',
      specifications: JSON.stringify({ Brand: 'COSORI', Capacity: '5.8 Quart', Power: '1700W', Functions: 12 }),
      price: 7469, original_price: 9959, stock: 123, categorySlug: 'home-kitchen', rating: 4.7, review_count: 67890, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1648567735273-0ddbb98bf26e?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Yankee Candle Large Jar - Vanilla Cupcake',
      description: 'Fill your home with the warm, inviting scent of freshly baked vanilla cupcakes. Burns up to 150 hours.',
      specifications: JSON.stringify({ Brand: 'Yankee Candle', Size: '22oz', 'Burn Time': '110-150 hours', Scent: 'Vanilla Cupcake' }),
      price: 1453, original_price: 2572, stock: 198, categorySlug: 'home-kitchen', rating: 4.7, review_count: 56789, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Cuisinart 14-Cup Food Processor',
      description: 'Handles any food prep task. Large feed tube, stainless steel blades.',
      specifications: JSON.stringify({ Brand: 'Cuisinart', Capacity: '14 Cup', Motor: '720W', Blades: 'Stainless Steel' }),
      price: 14936, original_price: 20749, stock: 45, categorySlug: 'home-kitchen', rating: 4.6, review_count: 12345, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- SPORTS & OUTDOORS (8 products) ----
    {
      name: 'Fitbit Charge 6 Fitness Tracker',
      description: 'Track your fitness with advanced health metrics. Built-in GPS, heart rate monitoring, 7-day battery.',
      specifications: JSON.stringify({ Brand: 'Fitbit', Model: 'Charge 6', Battery: '7 Days', GPS: 'Built-in', Sensors: 'HR, SpO2, ECG' }),
      price: 11616, original_price: 13276, stock: 56, categorySlug: 'sports-outdoors', rating: 4.5, review_count: 3421, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'YETI Rambler 30 oz Tumbler',
      description: 'Your drinks stay ice cold or scaldingly hot far longer. Double-wall insulated with 18/8 premium stainless steel.',
      specifications: JSON.stringify({ Brand: 'YETI', Capacity: '30 oz', Material: 'Stainless Steel', Insulation: 'Double-wall vacuum' }),
      price: 3486, original_price: 3486, stock: 230, categorySlug: 'sports-outdoors', rating: 4.8, review_count: 45678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Manduka PRO Yoga Mat 71" x 26"',
      description: 'The gold standard of yoga mats. Ultra-dense cushioning, superior grip.',
      specifications: JSON.stringify({ Brand: 'Manduka', Size: '71" x 26"', Thickness: '6mm', Material: 'PVC' }),
      price: 7636, original_price: 9960, stock: 56, categorySlug: 'sports-outdoors', rating: 4.7, review_count: 8765, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Coleman Sundome 4-Person Camping Tent',
      description: 'Easy 10-minute setup. WeatherTec system with patented welded floors.',
      specifications: JSON.stringify({ Brand: 'Coleman', Capacity: '4 Person', Setup: '10 minutes', Season: '3-Season' }),
      price: 5727, original_price: 9129, stock: 34, categorySlug: 'sports-outdoors', rating: 4.5, review_count: 23456, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Bowflex SelectTech 552 Adjustable Dumbbells',
      description: 'Replace 15 sets of weights with just one pair. Dial from 5 to 52.5 lbs.',
      specifications: JSON.stringify({ Brand: 'Bowflex', 'Weight Range': '5-52.5 lbs', Increments: '2.5 lb', Material: 'Steel/ABS' }),
      price: 28967, original_price: 35607, stock: 23, categorySlug: 'sports-outdoors', rating: 4.7, review_count: 15678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Hydro Flask 32oz Wide Mouth Water Bottle',
      description: 'TempShield double-wall vacuum insulation keeps drinks cold up to 24 hours.',
      specifications: JSON.stringify({ Brand: 'Hydro Flask', Capacity: '32oz', Insulation: 'TempShield Vacuum', Material: '18/8 Stainless Steel' }),
      price: 3005, original_price: 3731, stock: 143, categorySlug: 'sports-outdoors', rating: 4.8, review_count: 45678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Nike Dri-FIT Men Training T-Shirt',
      description: 'Sweat-wicking technology to keep you dry and comfortable.',
      specifications: JSON.stringify({ Brand: 'Nike', Material: '100% Polyester', Technology: 'Dri-FIT', Fit: 'Standard' }),
      price: 1657, original_price: 2490, stock: 234, categorySlug: 'sports-outdoors', rating: 4.5, review_count: 12345, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Garmin Forerunner 265 GPS Running Watch',
      description: 'AMOLED display running watch with training readiness and up to 13 days battery life.',
      specifications: JSON.stringify({ Brand: 'Garmin', Display: 'AMOLED', Battery: '13 days', GPS: 'Multi-band' }),
      price: 33199, original_price: 37349, stock: 29, categorySlug: 'sports-outdoors', rating: 4.6, review_count: 5678, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- BEAUTY & PERSONAL CARE (7 products) ----
    {
      name: 'Dyson Airwrap Multi-Styler',
      description: 'The ultimate luxury hair styling machine. Dry, curl, shape, smooth, and hide flyaways without extreme heat.',
      specifications: JSON.stringify({ Brand: 'Dyson', Power: '1300W', Technology: 'Coanda Airflow', HeatSettings: 3 }),
      price: 49799, original_price: 49799, stock: 12, categorySlug: 'beauty-personal-care', rating: 4.6, review_count: 5432, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/61l5KkEytnL._SL1500_.jpg', primary: true },
      ],
    },
    {
      name: 'Laneige Lip Sleeping Mask',
      description: 'Multi-award-winning leave-on lip mask that delivers intense moisture and antioxidants while you sleep.',
      specifications: JSON.stringify({ Brand: 'Laneige', Scent: 'Berry', Size: '20g', SkinType: 'All' }),
      price: 1992, original_price: 1992, stock: 449, categorySlug: 'beauty-personal-care', rating: 4.8, review_count: 34567, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/41R7LCjddAL._SL1100_.jpg', primary: true },
      ],
    },
    {
      name: 'CeraVe Moisturizing Cream 19oz',
      description: 'Developed with dermatologists. 3 essential ceramides. MVE technology for 24-hour hydration.',
      specifications: JSON.stringify({ Brand: 'CeraVe', Size: '19oz', Type: 'Cream', 'Skin Type': 'All' }),
      price: 1214, original_price: 1659, stock: 345, categorySlug: 'beauty-personal-care', rating: 4.8, review_count: 98765, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/61zO5gx-PHL._SL1500_.jpg', primary: true },
      ],
    },
    {
      name: 'Neutrogena Hydro Boost Water Gel Moisturizer',
      description: 'Lightweight water gel formula with hyaluronic acid.',
      specifications: JSON.stringify({ Brand: 'Neutrogena', Size: '1.7oz', Type: 'Water Gel', Key: 'Hyaluronic Acid' }),
      price: 1289, original_price: 1949, stock: 234, categorySlug: 'beauty-personal-care', rating: 4.6, review_count: 56789, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/71K4KnBq6KL._SL1500_.jpg', primary: true },
      ],
    },
    {
      name: 'Philips Norelco OneBlade Face + Body Trimmer',
      description: 'Trim, edge, and shave any length of hair. Unique OneBlade technology.',
      specifications: JSON.stringify({ Brand: 'Philips', Model: 'OneBlade', Battery: '60 min', Waterproof: 'Yes' }),
      price: 2902, original_price: 4564, stock: 156, categorySlug: 'beauty-personal-care', rating: 4.5, review_count: 34567, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/71JCvmCt-WL._SL1500_.jpg', primary: true },
      ],
    },
    {
      name: 'Maybelline Lash Sensational Sky High Mascara',
      description: 'Limitless length. Flex Tower mascara brush bends to reach every lash.',
      specifications: JSON.stringify({ Brand: 'Maybelline', Type: 'Mascara', Effect: 'Lengthening', 'Key Ingredient': 'Bamboo Extract' }),
      price: 745, original_price: 1120, stock: 456, categorySlug: 'beauty-personal-care', rating: 4.4, review_count: 67890, is_prime: true,
      images: [
        { url: 'https://m.media-amazon.com/images/I/71MQo8pHmBL._SL1500_.jpg', primary: true },
      ],
    },
    {
      name: 'The Ordinary Niacinamide 10% + Zinc 1% Serum',
      description: 'High-strength vitamin and mineral formula that reduces blemishes, congestion, and oiliness.',
      specifications: JSON.stringify({ Brand: 'The Ordinary', Size: '30ml', Type: 'Serum', Key: 'Niacinamide 10%, Zinc 1%' }),
      price: 481, original_price: 830, stock: 567, categorySlug: 'beauty-personal-care', rating: 4.5, review_count: 78901, is_prime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', primary: true },
      ],
    },
  ];

  console.log('\n📦 Creating products...');

  const productMap = {};
  for (const productData of products) {
    const { images, categorySlug, ...data } = productData;

    const product = await Product.create({
      name: data.name,
      description: data.description,
      specifications: data.specifications,
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      category_id: catMap[categorySlug],
      rating: data.rating,
      review_count: data.review_count,
      is_prime: data.is_prime,
    });

    // Create images
    for (let i = 0; i < images.length; i++) {
      await ProductImage.create({
        product_id: product._id,
        image_url: images[i].url,
        is_primary: images[i].primary,
        sort_order: i,
      });
    }

    productMap[data.name] = product._id;
    console.log(`  ✅ ${product.name.substring(0, 50)}...`);
  }

  console.log(`\n🎉 Seed complete! Created:`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products with images\n`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
