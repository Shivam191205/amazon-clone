/**
 * Database Seed Script
 * 
 * Seeds the PostgreSQL database with:
 * - 1 default user
 * - 6 product categories
 * - 50+ products with realistic data across all categories
 * - Multiple images per product
 * 
 * Run: npm run db:seed
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================
  // 1. Create default user
  // ============================================
  const user = await prisma.user.upsert({
    where: { email: 'default@amazon-clone.com' },
    update: {},
    create: {
      name: 'Default User',
      email: 'default@amazon-clone.com',
    },
  });
  console.log(`✅ User created: ${user.name} (ID: ${user.id})`);

  // ============================================
  // 2. Create categories
  // ============================================
  const categoryData = [
    { name: 'Electronics', slug: 'electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop' },
    { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop' },
    { name: 'Clothing', slug: 'clothing', imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', imageUrl: 'https://images.unsplash.com/photo-1461896836934-bd45ba9c5e3a?w=400&h=400&fit=crop' },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, imageUrl: cat.imageUrl },
      create: cat,
    });
    categories[cat.slug] = created.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  // ============================================
  // 3. Create products with images
  // ============================================
  const products = [
    // ---- ELECTRONICS (10 products) ----
    {
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours of battery life with quick charging. Multipoint connection allows switching between 2 Bluetooth devices.',
      specifications: JSON.stringify({ Brand: 'Sony', Model: 'WH-1000XM5', Color: 'Black', Connectivity: 'Bluetooth 5.2', Battery: '30 hours', Weight: '250g', 'Noise Cancellation': 'Yes - Adaptive' }),
      price: 348.00, originalPrice: 399.99, stock: 45, categorySlug: 'electronics', rating: 4.7, reviewCount: 12453, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', primary: false },
        { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Apple MacBook Air M3 Chip 15-inch Laptop',
      description: 'Supercharged by the M3 chip, MacBook Air is a thin, light, and fast laptop with a 15.3-inch Liquid Retina display. Up to 18 hours of battery life. 8-core CPU and up to 10-core GPU. Supports up to 24GB unified memory.',
      specifications: JSON.stringify({ Brand: 'Apple', Processor: 'M3 chip', RAM: '8GB', Storage: '256GB SSD', Display: '15.3" Liquid Retina', Battery: '18 hours', Weight: '1.51 kg' }),
      price: 1249.00, originalPrice: 1299.00, stock: 23, categorySlug: 'electronics', rating: 4.8, reviewCount: 8765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra 256GB Smartphone',
      description: 'Galaxy AI is here. Search like never before, Icons and Icons and Icons. 200MP camera, S Pen included, titanium frame, 6.8" QHD+ Dynamic AMOLED display with 120Hz refresh rate.',
      specifications: JSON.stringify({ Brand: 'Samsung', Model: 'Galaxy S24 Ultra', Storage: '256GB', RAM: '12GB', Display: '6.8" QHD+ AMOLED', Camera: '200MP', Battery: '5000mAh' }),
      price: 1199.99, originalPrice: 1419.99, stock: 34, categorySlug: 'electronics', rating: 4.6, reviewCount: 15432, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'JBL Charge 5 Portable Bluetooth Speaker',
      description: 'JBL Charge 5 speaker delivers bold JBL Original Pro Sound with its optimized long excursion driver, separate tweeter, and dual JBL bass radiators. Up to 20 hours of playtime, IP67 waterproof and dustproof.',
      specifications: JSON.stringify({ Brand: 'JBL', Model: 'Charge 5', 'Battery Life': '20 hours', Waterproof: 'IP67', Bluetooth: '5.1', Weight: '960g' }),
      price: 149.95, originalPrice: 179.95, stock: 78, categorySlug: 'electronics', rating: 4.7, reviewCount: 23456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Logitech MX Master 3S Wireless Mouse',
      description: 'Advanced wireless mouse with ultra-fast MagSpeed scroll wheel, ergonomic design, 8K DPI tracking on any surface, USB-C rechargeable, and multi-device connectivity.',
      specifications: JSON.stringify({ Brand: 'Logitech', Model: 'MX Master 3S', DPI: '8000', Connectivity: 'Bluetooth, USB receiver', Battery: '70 days', Weight: '141g' }),
      price: 89.99, originalPrice: 99.99, stock: 120, categorySlug: 'electronics', rating: 4.8, reviewCount: 9876, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Apple iPad Air 11-inch M2 Chip 128GB',
      description: 'The new iPad Air with M2 chip. 11-inch Liquid Retina display, 12MP front camera with Center Stage, works with Apple Pencil Pro and Magic Keyboard.',
      specifications: JSON.stringify({ Brand: 'Apple', Chip: 'M2', Display: '11" Liquid Retina', Storage: '128GB', Camera: '12MP', Weight: '462g' }),
      price: 599.00, originalPrice: null, stock: 56, categorySlug: 'electronics', rating: 4.8, reviewCount: 5678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Canon EOS R50 Mirrorless Camera with 18-45mm Lens',
      description: 'Compact and lightweight mirrorless camera with 24.2MP APS-C sensor, 4K video recording, eye-detection autofocus, and built-in Wi-Fi and Bluetooth.',
      specifications: JSON.stringify({ Brand: 'Canon', Model: 'EOS R50', Sensor: '24.2MP APS-C', Video: '4K 30fps', Display: '3" Vari-angle', Weight: '375g' }),
      price: 679.99, originalPrice: 799.99, stock: 19, categorySlug: 'electronics', rating: 4.5, reviewCount: 3456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Amazon Echo Dot 5th Gen Smart Speaker with Alexa',
      description: 'Our best sounding Echo Dot yet. Enjoy an improved audio experience with clearer vocals, deeper bass, and vibrant sound. Ask Alexa to play music, answer questions, and control smart home devices.',
      specifications: JSON.stringify({ Brand: 'Amazon', Model: 'Echo Dot 5th Gen', Speaker: '1.73" driver', Connectivity: 'Wi-Fi, Bluetooth', Assistant: 'Alexa' }),
      price: 27.99, originalPrice: 49.99, stock: 200, categorySlug: 'electronics', rating: 4.6, reviewCount: 45678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Samsung 55" Crystal 4K UHD Smart TV',
      description: 'Crystal Processor 4K delivers a crystal clear, naturally vivid picture. PurColor technology reproduces 100% of colors. Smart TV with built-in streaming apps.',
      specifications: JSON.stringify({ Brand: 'Samsung', Size: '55 inches', Resolution: '4K UHD', 'HDR': 'HDR10+', 'Smart TV': 'Tizen OS', 'Refresh Rate': '60Hz' }),
      price: 347.99, originalPrice: 529.99, stock: 15, categorySlug: 'electronics', rating: 4.5, reviewCount: 18765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Anker 20000mAh Portable Power Bank USB-C',
      description: 'High-capacity 20000mAh portable charger with 20W USB-C fast charging. Charge 2 devices simultaneously. TSA-approved for carry-on bags.',
      specifications: JSON.stringify({ Brand: 'Anker', Capacity: '20000mAh', Output: '20W USB-C', Ports: 'USB-C + USB-A', Weight: '340g' }),
      price: 35.99, originalPrice: 45.99, stock: 150, categorySlug: 'electronics', rating: 4.7, reviewCount: 34567, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- BOOKS (9 products) ----
    {
      name: 'Atomic Habits by James Clear - Hardcover',
      description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      specifications: JSON.stringify({ Author: 'James Clear', Pages: 320, Publisher: 'Avery', Language: 'English', Format: 'Hardcover', ISBN: '978-0735211292' }),
      price: 11.98, originalPrice: 27.00, stock: 340, categorySlug: 'books', rating: 4.8, reviewCount: 98765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'The Psychology of Money by Morgan Housel',
      description: 'Timeless lessons on wealth, greed, and happiness. In The Psychology of Money, award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money.',
      specifications: JSON.stringify({ Author: 'Morgan Housel', Pages: 256, Publisher: 'Harriman House', Language: 'English', Format: 'Paperback' }),
      price: 14.99, originalPrice: 18.99, stock: 230, categorySlug: 'books', rating: 4.7, reviewCount: 67890, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Clean Code by Robert C. Martin',
      description: 'A Handbook of Agile Software Craftsmanship. Even bad code can function. But if code is not clean, it can bring a development organization to its knees. This book is a must-read for every developer.',
      specifications: JSON.stringify({ Author: 'Robert C. Martin', Pages: 464, Publisher: 'Prentice Hall', Language: 'English', Format: 'Paperback' }),
      price: 33.49, originalPrice: 49.99, stock: 89, categorySlug: 'books', rating: 4.6, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Sapiens: A Brief History of Humankind',
      description: 'From a renowned historian comes a groundbreaking narrative of humanity creation and evolution. Yuval Noah Harari boldly spans the whole of human history, exploring how biology and history have defined us.',
      specifications: JSON.stringify({ Author: 'Yuval Noah Harari', Pages: 464, Publisher: 'Harper Perennial', Language: 'English', Format: 'Paperback' }),
      price: 15.49, originalPrice: 22.99, stock: 156, categorySlug: 'books', rating: 4.6, reviewCount: 87654, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Thinking, Fast and Slow by Daniel Kahneman',
      description: 'In this international bestseller, Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
      specifications: JSON.stringify({ Author: 'Daniel Kahneman', Pages: 499, Publisher: 'Farrar, Straus and Giroux', Language: 'English', Format: 'Paperback' }),
      price: 11.99, originalPrice: 19.00, stock: 178, categorySlug: 'books', rating: 4.6, reviewCount: 54321, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'The Pragmatic Programmer 20th Anniversary Edition',
      description: 'Your journey to mastery. Updated for modern development, this classic guide covers everything from personal responsibility and career development to architectural techniques.',
      specifications: JSON.stringify({ Author: 'David Thomas, Andrew Hunt', Pages: 352, Publisher: 'Addison-Wesley', Language: 'English', Format: 'Hardcover' }),
      price: 39.49, originalPrice: 59.99, stock: 67, categorySlug: 'books', rating: 4.7, reviewCount: 8765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Deep Work by Cal Newport',
      description: 'Rules for Focused Success in a Distracted World. Cal Newport flips the narrative on impact in a connected age. Deep work is the ability to focus without distraction on a cognitively demanding task.',
      specifications: JSON.stringify({ Author: 'Cal Newport', Pages: 304, Publisher: 'Grand Central Publishing', Language: 'English', Format: 'Paperback' }),
      price: 12.49, originalPrice: 18.00, stock: 198, categorySlug: 'books', rating: 4.6, reviewCount: 23456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Dune by Frank Herbert - Paperback',
      description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world. A stunning blend of adventure and mysticism.',
      specifications: JSON.stringify({ Author: 'Frank Herbert', Pages: 688, Publisher: 'Ace', Language: 'English', Format: 'Paperback' }),
      price: 10.99, originalPrice: 18.99, stock: 256, categorySlug: 'books', rating: 4.7, reviewCount: 45678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'System Design Interview by Alex Xu',
      description: 'An insider guide covering system design interview questions with step-by-step guides. Learn how to design large-scale distributed systems from real-world examples.',
      specifications: JSON.stringify({ Author: 'Alex Xu', Pages: 320, Publisher: 'Byte Code LLC', Language: 'English', Format: 'Paperback' }),
      price: 29.99, originalPrice: 39.99, stock: 123, categorySlug: 'books', rating: 4.5, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- CLOTHING (9 products) ----
    {
      name: "Levi's 501 Original Fit Men's Jeans",
      description: "The original jean. The icon. The 501 Original Fit Jeans sit at the waist with a regular fit through the thigh and a straight leg. Button fly. 100% cotton denim.",
      specifications: JSON.stringify({ Brand: "Levi's", Fit: 'Original', Material: '100% Cotton', Closure: 'Button Fly', Care: 'Machine Washable' }),
      price: 46.49, originalPrice: 69.50, stock: 89, categorySlug: 'clothing', rating: 4.5, reviewCount: 34567, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Nike Air Max 270 Running Shoes - Men',
      description: "Nike's first lifestyle Air Max brings you style, comfort, and big attitude. The shoe features Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
      specifications: JSON.stringify({ Brand: 'Nike', Model: 'Air Max 270', Material: 'Mesh upper', Sole: 'Rubber', 'Air Unit': 'Max Air 270' }),
      price: 119.99, originalPrice: 150.00, stock: 67, categorySlug: 'clothing', rating: 4.5, reviewCount: 23456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Champion Reverse Weave Hoodie - Unisex',
      description: 'The iconic Champion Reverse Weave hoodie. Heavyweight fleece, ribbed side panels to reduce shrinkage, and the classic C logo on the sleeve. A streetwear staple.',
      specifications: JSON.stringify({ Brand: 'Champion', Material: '82% Cotton, 18% Polyester', Fit: 'Relaxed', Hood: 'Drawstring', Pocket: 'Kangaroo' }),
      price: 45.00, originalPrice: 70.00, stock: 145, categorySlug: 'clothing', rating: 4.6, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Ray-Ban Aviator Classic Sunglasses',
      description: 'The iconic Ray-Ban Aviator sunglasses. Originally designed for U.S. aviators in 1937. Crystal green lenses with gold metal frame. UV protection.',
      specifications: JSON.stringify({ Brand: 'Ray-Ban', Model: 'RB3025', Frame: 'Gold Metal', Lens: 'Crystal Green', Protection: 'UV400', Size: '58mm' }),
      price: 161.00, originalPrice: 182.00, stock: 43, categorySlug: 'clothing', rating: 4.7, reviewCount: 34567, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Adidas Ultraboost Light Running Shoes - Women',
      description: 'Experience epic energy with Light BOOST cushioning. The Ultraboost Light features 30% lighter BOOST midsole using innovative Light BOOST technology.',
      specifications: JSON.stringify({ Brand: 'Adidas', Model: 'Ultraboost Light', Material: 'Primeknit upper', Sole: 'Continental Rubber', Cushioning: 'Light BOOST' }),
      price: 139.99, originalPrice: 190.00, stock: 54, categorySlug: 'clothing', rating: 4.6, reviewCount: 8765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Columbia Watertight II Rain Jacket - Men',
      description: 'Stay dry in the rain with this lightweight, packable rain jacket featuring Omni-Tech waterproof technology. Adjustable storm hood and zippered hand pockets.',
      specifications: JSON.stringify({ Brand: 'Columbia', Material: 'Nylon', Waterproof: 'Omni-Tech', Fit: 'Modern Classic', Hood: 'Adjustable Storm Hood' }),
      price: 49.99, originalPrice: 90.00, stock: 87, categorySlug: 'clothing', rating: 4.5, reviewCount: 15678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Calvin Klein Classic Fit Dress Shirt - Men',
      description: 'A sophisticated dress shirt featuring a classic fit, point collar, and barrel cuffs. Wrinkle-free performance fabric for all-day comfort.',
      specifications: JSON.stringify({ Brand: 'Calvin Klein', Material: '100% Cotton', Fit: 'Classic', Collar: 'Point', Cuff: 'Barrel' }),
      price: 29.99, originalPrice: 49.50, stock: 134, categorySlug: 'clothing', rating: 4.4, reviewCount: 7654, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Herschel Supply Co. Classic Backpack',
      description: 'The Herschel Classic Backpack is a reimagined everyday essential. Features a large main compartment and a 15" laptop sleeve. Made with signature striped fabric liner.',
      specifications: JSON.stringify({ Brand: 'Herschel', Volume: '24L', Material: 'Polyester', Laptop: '15"', Closure: 'Zipper' }),
      price: 39.99, originalPrice: 54.99, stock: 98, categorySlug: 'clothing', rating: 4.6, reviewCount: 23456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Casio G-Shock Digital Watch - Black',
      description: 'The legendary G-Shock. Shock-resistant, 200m water resistance, LED backlight, stopwatch, countdown timer, and 5 daily alarms. Built to last.',
      specifications: JSON.stringify({ Brand: 'Casio', Model: 'DW5600E-1V', 'Water Resistance': '200m', Display: 'Digital', Battery: 'CR2016 (2 years)', Weight: '53g' }),
      price: 42.40, originalPrice: 69.95, stock: 167, categorySlug: 'clothing', rating: 4.7, reviewCount: 45678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- HOME & KITCHEN (9 products) ----
    {
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt',
      description: '7-in-1 functionality: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 13 one-touch programs for easy cooking.',
      specifications: JSON.stringify({ Brand: 'Instant Pot', Capacity: '6 Quart', Material: 'Stainless Steel', Programs: '13', Power: '1000W', Dishwasher: 'Lid & Pot safe' }),
      price: 79.95, originalPrice: 99.99, stock: 234, categorySlug: 'home-kitchen', rating: 4.7, reviewCount: 156789, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Keurig K-Elite Single Serve Coffee Maker',
      description: 'Brew your perfect cup. Features 5 brew sizes, strong brew button, iced setting, and a 75oz water reservoir. Compatible with all K-Cup pods.',
      specifications: JSON.stringify({ Brand: 'Keurig', Model: 'K-Elite', Reservoir: '75oz', 'Brew Sizes': '4, 6, 8, 10, 12 oz', Color: 'Brushed Slate' }),
      price: 149.99, originalPrice: 189.99, stock: 67, categorySlug: 'home-kitchen', rating: 4.5, reviewCount: 23456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'iRobot Roomba 694 Robot Vacuum',
      description: 'Wi-Fi connected robot vacuum that cleans on your schedule. 3-Stage Cleaning System lifts dirt from carpets and hard floors. Works with Alexa and Google.',
      specifications: JSON.stringify({ Brand: 'iRobot', Model: 'Roomba 694', Runtime: '90 min', Navigation: 'iAdapt', Connectivity: 'Wi-Fi', Dustbin: '0.3L' }),
      price: 179.99, originalPrice: 274.99, stock: 34, categorySlug: 'home-kitchen', rating: 4.4, reviewCount: 45678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Ninja Professional Plus Blender 1400W',
      description: 'Professional performance with Total Crushing Technology. 72oz pitcher, single-serve cup, and 1400 watts of professional power for smoothies, frozen drinks, and food processing.',
      specifications: JSON.stringify({ Brand: 'Ninja', Power: '1400W', Capacity: '72oz', Blades: 'Stacked Blade', BPA: 'Free', Dishwasher: 'Safe' }),
      price: 79.99, originalPrice: 119.99, stock: 89, categorySlug: 'home-kitchen', rating: 4.7, reviewCount: 34567, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'AmazonBasics 18-Piece Dinnerware Set',
      description: 'Complete dinnerware set for 6 people. Includes 6 dinner plates, 6 salad plates, and 6 bowls. Made of durable AB-grade porcelain. Microwave and dishwasher safe.',
      specifications: JSON.stringify({ Brand: 'AmazonBasics', Pieces: 18, Material: 'AB-Grade Porcelain', 'Service For': 6, Microwave: 'Safe', Dishwasher: 'Safe' }),
      price: 35.99, originalPrice: 47.99, stock: 178, categorySlug: 'home-kitchen', rating: 4.5, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Lodge 10.25-inch Pre-Seasoned Cast Iron Skillet',
      description: 'The Lodge Cast Iron Skillet is a timeless kitchen essential. Pre-seasoned with 100% vegetable oil. Unparalleled heat retention for even cooking.',
      specifications: JSON.stringify({ Brand: 'Lodge', Size: '10.25 inches', Material: 'Cast Iron', Seasoning: 'Vegetable Oil', Oven: 'Safe to 500°F', Made: 'USA' }),
      price: 19.90, originalPrice: 34.99, stock: 245, categorySlug: 'home-kitchen', rating: 4.7, reviewCount: 87654, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'COSORI Air Fryer Pro II 5.8Qt',
      description: 'Cook your favorite fried foods with up to 85% less fat. 12 one-touch cooking functions, shake reminder, and dishwasher-safe basket. 100 original recipes included.',
      specifications: JSON.stringify({ Brand: 'COSORI', Capacity: '5.8 Quart', Power: '1700W', Functions: 12, Temp: '170-400°F', Dishwasher: 'Basket safe' }),
      price: 89.99, originalPrice: 119.99, stock: 123, categorySlug: 'home-kitchen', rating: 4.7, reviewCount: 67890, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1648567735273-0ddbb98bf26e?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Yankee Candle Large Jar - Vanilla Cupcake',
      description: 'Fill your home with the warm, inviting scent of freshly baked vanilla cupcakes. Premium-grade paraffin wax with natural fiber wick. Burns up to 150 hours.',
      specifications: JSON.stringify({ Brand: 'Yankee Candle', Size: '22oz', 'Burn Time': '110-150 hours', Scent: 'Vanilla Cupcake', Material: 'Paraffin Wax' }),
      price: 17.50, originalPrice: 30.99, stock: 198, categorySlug: 'home-kitchen', rating: 4.7, reviewCount: 56789, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Cuisinart 14-Cup Food Processor',
      description: 'The Cuisinart 14-Cup Food Processor handles any food prep task. Large feed tube, stainless steel blades, and multiple disc attachments for shredding and slicing.',
      specifications: JSON.stringify({ Brand: 'Cuisinart', Capacity: '14 Cup', Motor: '720W', Blades: 'Stainless Steel', BPA: 'Free', Dishwasher: 'Safe parts' }),
      price: 179.95, originalPrice: 249.99, stock: 45, categorySlug: 'home-kitchen', rating: 4.6, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- SPORTS & OUTDOORS (8 products) ----
    {
      name: 'YETI Rambler 26oz Bottle Stainless Steel',
      description: 'The YETI Rambler 26oz keeps your water cold (or coffee hot) for hours. 18/8 stainless steel, double-wall vacuum insulation, and a dishwasher-safe design.',
      specifications: JSON.stringify({ Brand: 'YETI', Capacity: '26oz', Material: '18/8 Stainless Steel', Insulation: 'Double-wall Vacuum', Dishwasher: 'Safe', BPA: 'Free' }),
      price: 35.00, originalPrice: 40.00, stock: 189, categorySlug: 'sports-outdoors', rating: 4.8, reviewCount: 34567, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Fitbit Charge 6 Advanced Fitness Tracker',
      description: 'Track your fitness like never before with advanced health metrics. Built-in GPS, heart rate monitoring, sleep tracking, SpO2, and 7-day battery life. Google integration.',
      specifications: JSON.stringify({ Brand: 'Fitbit', Model: 'Charge 6', Display: 'AMOLED', Battery: '7 days', GPS: 'Built-in', Water: '50m resistant' }),
      price: 139.95, originalPrice: 159.95, stock: 78, categorySlug: 'sports-outdoors', rating: 4.3, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Manduka PRO Yoga Mat 71" x 26"',
      description: 'The gold standard of yoga mats. Ultra-dense cushioning, superior grip, and lifetime guarantee. Closed-cell surface prevents sweat from seeping in. Oeko-Tex certified.',
      specifications: JSON.stringify({ Brand: 'Manduka', Size: '71" x 26"', Thickness: '6mm', Material: 'PVC', Weight: '7.5 lbs', Certification: 'Oeko-Tex' }),
      price: 92.00, originalPrice: 120.00, stock: 56, categorySlug: 'sports-outdoors', rating: 4.7, reviewCount: 8765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Coleman Sundome 4-Person Camping Tent',
      description: 'Easy 10-minute setup. WeatherTec system with patented welded floors and inverted seams to keep water out. Fits 1 queen air mattress. Dome design for strong wind resistance.',
      specifications: JSON.stringify({ Brand: 'Coleman', Capacity: '4 Person', Setup: '10 minutes', Dimensions: "9' x 7'", Height: "4'11\"", Season: '3-Season' }),
      price: 69.00, originalPrice: 109.99, stock: 34, categorySlug: 'sports-outdoors', rating: 4.5, reviewCount: 23456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Bowflex SelectTech 552 Adjustable Dumbbells',
      description: 'Replace 15 sets of weights with just one pair. Dial from 5 to 52.5 lbs with a simple turn. Space-efficient design for home workouts.',
      specifications: JSON.stringify({ Brand: 'Bowflex', 'Weight Range': '5-52.5 lbs', Increments: '2.5 lb', Material: 'Steel/ABS', Dimensions: '15.75" each' }),
      price: 349.00, originalPrice: 429.00, stock: 23, categorySlug: 'sports-outdoors', rating: 4.7, reviewCount: 15678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Hydro Flask 32oz Wide Mouth Water Bottle',
      description: 'TempShield double-wall vacuum insulation keeps drinks cold up to 24 hours and hot up to 12 hours. BPA-free, durable powder coat finish.',
      specifications: JSON.stringify({ Brand: 'Hydro Flask', Capacity: '32oz', Insulation: 'TempShield Vacuum', Material: '18/8 Stainless Steel', BPA: 'Free' }),
      price: 36.21, originalPrice: 44.95, stock: 143, categorySlug: 'sports-outdoors', rating: 4.8, reviewCount: 45678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Nike Dri-FIT Men Training T-Shirt',
      description: 'Sweat-wicking technology to keep you dry and comfortable during your workout. Lightweight, breathable mesh fabric with an athletic fit.',
      specifications: JSON.stringify({ Brand: 'Nike', Material: '100% Polyester', Technology: 'Dri-FIT', Fit: 'Standard', Care: 'Machine Wash' }),
      price: 19.97, originalPrice: 30.00, stock: 234, categorySlug: 'sports-outdoors', rating: 4.5, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Garmin Forerunner 265 GPS Running Watch',
      description: 'AMOLED display running watch with training readiness, daily suggested workouts, race widgets, and up to 13 days battery life. Multi-band GPS for precise tracking.',
      specifications: JSON.stringify({ Brand: 'Garmin', Display: 'AMOLED', Battery: '13 days', GPS: 'Multi-band', 'Water Rating': '5 ATM', Weight: '47g' }),
      price: 399.99, originalPrice: 449.99, stock: 29, categorySlug: 'sports-outdoors', rating: 4.6, reviewCount: 5678, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop', primary: true },
      ],
    },

    // ---- BEAUTY & PERSONAL CARE (7 products) ----
    {
      name: 'CeraVe Moisturizing Cream 19oz',
      description: 'Developed with dermatologists, CeraVe Moisturizing Cream has 3 essential ceramides to help restore the skin barrier. MVE technology for 24-hour hydration. Fragrance-free.',
      specifications: JSON.stringify({ Brand: 'CeraVe', Size: '19oz', Type: 'Cream', 'Skin Type': 'All', Key: '3 Essential Ceramides', Fragrance: 'Free' }),
      price: 14.63, originalPrice: 19.99, stock: 345, categorySlug: 'beauty-personal-care', rating: 4.8, reviewCount: 98765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Dyson Supersonic Hair Dryer',
      description: 'Intelligent heat control to protect your hair from extreme heat damage. Engineered for different hair types. Fast drying with no extreme heat.',
      specifications: JSON.stringify({ Brand: 'Dyson', Motor: 'V9 Digital', Speed: '3 settings', Heat: '4 settings', Attachments: 5, Weight: '659g' }),
      price: 399.99, originalPrice: 429.99, stock: 18, categorySlug: 'beauty-personal-care', rating: 4.6, reviewCount: 23456, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1522338242992-e1a54571a3f3?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Neutrogena Hydro Boost Water Gel Moisturizer',
      description: 'Lightweight water gel formula with hyaluronic acid quenches skin for smooth, supple, hydrated skin day after day. Oil-free, non-comedogenic.',
      specifications: JSON.stringify({ Brand: 'Neutrogena', Size: '1.7oz', Type: 'Water Gel', Key: 'Hyaluronic Acid', 'Skin Type': 'Normal to Dry', 'Oil Free': 'Yes' }),
      price: 15.53, originalPrice: 23.49, stock: 234, categorySlug: 'beauty-personal-care', rating: 4.6, reviewCount: 56789, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Philips Norelco OneBlade Face + Body Trimmer',
      description: 'Trim, edge, and shave any length of hair. Unique OneBlade technology for a comfortable shave. Includes 3 stubble combs and 1 body comb. Wet & dry use.',
      specifications: JSON.stringify({ Brand: 'Philips', Model: 'OneBlade', Battery: '60 min', Charging: 'USB-C', Combs: '4 included', Waterproof: 'Yes' }),
      price: 34.96, originalPrice: 54.99, stock: 156, categorySlug: 'beauty-personal-care', rating: 4.5, reviewCount: 34567, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1585652757141-8837d023e98f?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Maybelline Lash Sensational Sky High Mascara',
      description: 'Limitless length. Flex Tower mascara brush bends to reach every lash for full fan effect. Infused with bamboo extract for long, full, and defined lashes.',
      specifications: JSON.stringify({ Brand: 'Maybelline', Type: 'Mascara', Effect: 'Lengthening', 'Key Ingredient': 'Bamboo Extract', Waterproof: 'Available' }),
      price: 8.98, originalPrice: 13.49, stock: 456, categorySlug: 'beauty-personal-care', rating: 4.4, reviewCount: 67890, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1631214540553-3707be37d408?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'Oral-B iO Series 9 Electric Toothbrush',
      description: 'Revolutionary iO technology combines a dentist-clean feeling with Oral-B gentle care. AI-powered 3D tracking, 7 smart modes, and interactive display.',
      specifications: JSON.stringify({ Brand: 'Oral-B', Model: 'iO Series 9', Modes: 7, Display: 'Color', Battery: '14 days', Includes: 'Travel case + 4 brush heads' }),
      price: 199.94, originalPrice: 299.99, stock: 34, categorySlug: 'beauty-personal-care', rating: 4.6, reviewCount: 12345, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1559467278-020d6a1b2ffe?w=600&h=600&fit=crop', primary: true },
      ],
    },
    {
      name: 'The Ordinary Niacinamide 10% + Zinc 1% Serum',
      description: 'A high-strength vitamin and mineral formula that reduces the appearance of blemishes, congestion, and oiliness. Cruelty-free, vegan, and affordable skincare.',
      specifications: JSON.stringify({ Brand: 'The Ordinary', Size: '30ml', Type: 'Serum', Key: 'Niacinamide 10%, Zinc 1%', 'Skin Type': 'Oily/Combination', Vegan: 'Yes' }),
      price: 5.80, originalPrice: 10.00, stock: 567, categorySlug: 'beauty-personal-care', rating: 4.5, reviewCount: 78901, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', primary: true },
      ],
    },
    // ---- ADDED DEVICES ----
    {
      name: 'Google Pixel 8 Pro 128GB',
      description: 'The Pixel 8 Pro features the new Tensor G3 chip, advanced AI features, a stunning 6.7" Super Actua display, and upgraded Pro-level cameras with Magic Editor.',
      specifications: JSON.stringify({ Brand: 'Google', Model: 'Pixel 8 Pro', Storage: '128GB', RAM: '12GB', Display: '6.7" LTPO OLED', Camera: '50MP', Battery: '5050mAh' }),
      price: 999.00, originalPrice: 1099.00, stock: 45, categorySlug: 'electronics', rating: 4.8, reviewCount: 5200, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Asus ROG Strix G16 Gaming Laptop',
      description: 'Power your play. Draw more frames and win more games with the brand new Strix G16. Featuring an Intel Core i9 processor and an NVIDIA GeForce RTX 4070 Laptop GPU.',
      specifications: JSON.stringify({ Brand: 'ASUS', Processor: 'Intel Core i9', RAM: '16GB DDR5', Storage: '1TB SSD', GPU: 'RTX 4070', Display: '16" 165Hz' }),
      price: 1399.99, originalPrice: 1549.99, stock: 12, categorySlug: 'electronics', rating: 4.6, reviewCount: 1450, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop', primary: false },
      ],
    },
  ];

  console.log('\n📦 Creating products...');

  for (const productData of products) {
    const { images, categorySlug, ...data } = productData;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        specifications: data.specifications,
        price: data.price * 83,
        originalPrice: data.originalPrice ? data.originalPrice * 83 : null,
        stock: data.stock,
        categoryId: categories[categorySlug],
        rating: data.rating,
        reviewCount: data.reviewCount,
        isPrime: data.isPrime,
        images: {
          create: images.map((img, index) => ({
            imageUrl: img.url,
            isPrimary: img.primary,
            sortOrder: index,
          })),
        },
      },
    });

    console.log(`  ✅ ${product.name.substring(0, 50)}...`);
  }

  console.log(`\n🎉 Seed complete! Created:`);
  console.log(`   - 1 user`);
  console.log(`   - ${categoryData.length} categories`);
  console.log(`   - ${products.length} products with images\n`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
