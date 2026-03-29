const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

const categoryData = [
  { name: 'Electronics', slug: 'electronics', imageUrl: '/images/categories/electronics.png' },
  { name: 'Books', slug: 'books', imageUrl: '/images/categories/books.png' },
  { name: 'Clothing', slug: 'clothing', imageUrl: '/images/categories/clothing.png' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: '/images/categories/home.png' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', imageUrl: '/images/categories/sports.png' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', imageUrl: '/images/categories/beauty.png' },
];

const products = [
    // ---- ELECTRONICS ----
    {
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      description: 'Experience industry-leading noise cancellation technology that revolutionizes how you listen to music. The Sony WH-1000XM5 headphones feature the integrated Processor V1 that unlocks the full potential of our HD Noise Cancelling Processor QN1. This combination delivers unmatched audio quality, completely immersing you in high-fidelity sound. Designed with ultra-comfortable lightweight materials, these headphones provide all-day comfort without pressure. Enjoy crystal clear hands-free calling backed by precise voice pickup and advanced audio signal processing. The battery lasts an exceptional 30 hours, ensuring you always have power during long flights or commutes. Quick charging adds 3 hours of playback with just a 3-minute charge.',
      specifications: JSON.stringify({ Brand: 'Sony', Model: 'WH-1000XM5', Color: 'Black', Connectivity: 'Bluetooth 5.2', Battery: '30 hours', Weight: '250g', 'Noise Cancellation': 'Yes - Adaptive' }),
      price: 348.00, originalPrice: 399.99, stock: 45, categorySlug: 'electronics', rating: 4.7, reviewCount: 12453, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Apple MacBook Air M3 Chip 15-inch Laptop',
      description: 'Supercharged by the groundbreaking M3 chip, the new 15-inch MacBook Air is an exceptionally thin, light, and hyper-fast portable powerhouse. Featuring a breathtaking 15.3-inch Liquid Retina display with over 500 nits of brightness and P3 wide color, images pop with brilliant realism. The M3 processor combines an 8-core CPU with up to a 10-core GPU, providing accelerated performance for everything from daily productivity to intense graphical editing workloads. Designed to run completely silently with a fanless architecture, it lasts up to 18 hours on a single charge. Whether you’re compiling code, editing 4K video streams, or managing complex spreadsheets, this MacBook handles it gracefully.',
      specifications: JSON.stringify({ Brand: 'Apple', Processor: 'M3 chip', RAM: '8GB', Storage: '256GB SSD', Display: '15.3" Liquid Retina', Battery: '18 hours', Weight: '1.51 kg' }),
      price: 1249.00, originalPrice: 1299.00, stock: 23, categorySlug: 'electronics', rating: 4.8, reviewCount: 8765, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Asus ROG Strix G16 Gaming Laptop',
      description: 'Power your competitive edge and draw more frames per second with the brand new Strix G16. Armed to the teeth with the latest Intel Core i9 processor and an NVIDIA GeForce RTX 4070 Laptop GPU, this titan tears through modern AAA games, intensive rendering tasks, and heavy multitasking workloads effortlessly. Featuring a brilliant 16-inch QHD+ 165Hz display, every frame is flawlessly rendered with exceptional color accuracy and buttery smooth sync. The revolutionary Tri-Fan setup aggressively cools the chassis, ensuring your thermal limits are never throttled during intense marathon sessions. Command the battlefield today with Asus ROG.',
      specifications: JSON.stringify({ Brand: 'ASUS', Processor: 'Intel Core i9', RAM: '16GB DDR5', Storage: '1TB SSD', GPU: 'RTX 4070', Display: '16" 165Hz' }),
      price: 1399.99, originalPrice: 1549.99, stock: 12, categorySlug: 'electronics', rating: 4.6, reviewCount: 1450, isPrime: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=600&fit=crop', primary: true },
        { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop', primary: false },
      ],
    },
    {
      name: 'Google Pixel 8 Pro 128GB',
      description: 'Meet the meticulously crafted Pixel 8 Pro, completely reimagined inside and out. Powered by the all-new Tensor G3 chip—Google’s most powerful and responsive AI engine yet—the phone radically improves computational photography and video optimization mechanics. With advanced AI features baked directly into its software, you can edit out unwanted photobombers instantly with Magic Eraser, and seamlessly swap faces using Best Take to ensure group photos are universally flawless. Its stunning symmetrically polished chassis houses a brilliantly vivid 6.7" Super Actua display, which shines brightly under absolute direct sunlight. Take pro-level images any time, anywhere.',
      specifications: JSON.stringify({ Brand: 'Google', Model: 'Pixel 8 Pro', Storage: '128GB', RAM: '12GB', Display: '6.7" LTPO OLED', Camera: '50MP', Battery: '5050mAh' }),
      price: 999.00, originalPrice: 1099.00, stock: 45, categorySlug: 'electronics', rating: 4.8, reviewCount: 5200, isPrime: true,
      images: [
        { url: '/images/pixel_8_pro_1774727287831.png', primary: true },
        { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', primary: false },
      ],
    },
    // ---- BEAUTY ----
    {
      name: 'Dyson Airwrap Multi-Styler',
      description: 'The ultimate luxury hair styling machine. Dry, curl, shape, smooth, and hide those pesky flyaways without introducing extreme, damaging heat. Fully re-engineered, the magnetic attachments natively harness our Enhanced Coanda airflow phenomenon—wrapping hair automatically to create voluminous, cinematic curls. By combining intelligent heat control that measures temperatures over 40 times a second with aggressive aerodynamic manipulation, the Airwrap safeguards your natural hair texture. With barrels for both loose curls and tight waves, it’s like having a premium salon available inside your own master bathroom. Achieve a spectacular blowout finish in half the time.',
      specifications: JSON.stringify({ Brand: 'Dyson', Power: '1300W', Technology: 'Coanda Airflow', HeatSettings: 3 }),
      price: 599.99, originalPrice: 599.99, stock: 12, categorySlug: 'beauty-personal-care', rating: 4.6, reviewCount: 5432, isPrime: true,
      images: [{ url: '/images/dyson_airwrap_1774727320291.png', primary: true }],
    },
    {
      name: 'Laneige Lip Sleeping Mask',
      description: 'Say goodbye to flaky, parched lips. This multi-award-winning leave-on lip mask delivers profound, intense moisture and potent antioxidants while you sleep soundly. Supercharged by our revolutionary Moisture Wrap™ technology and heavily infused with a nourishing Berry Mix Complex™, the mask melts onto the skin, forming a sustained protective film over the lips. Wake up to noticeably softer, plumper, and drastically more supple lips every single morning. The luxurious balm texture is beautifully lightweight without feeling heavy or sticky. An absolute cult favorite essential for all year-round maintenance.',
      specifications: JSON.stringify({ Brand: 'Laneige', Scent: 'Berry', Size: '20g', SkinType: 'All' }),
      price: 24.00, originalPrice: 24.00, stock: 450, categorySlug: 'beauty-personal-care', rating: 4.8, reviewCount: 34567, isPrime: true,
      images: [{ url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', primary: true }],
    },
    // ---- HOME & KITCHEN ----
    {
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
      description: 'America’s most beloved mega-multicooker is back! The legendary 7-in-1 kitchen appliance natively functions as an advanced electric pressure cooker, slow cooker, rice cooker, yogurt maker, robust steamer, flawless sauté pan, and an intuitive food warmer. Utilizing heavy-duty stainless-steel construction with highly sophisticated microprocessor mechanics, it monitors pressure and temperature to constantly optimize heat magnitude and duration. Get dinner on the table 70% faster without sacrificing culinary quality or nutritional value! The gigantic 6-quart volume supports massive family portions, easily managing large batches of soup, brisket, or chili directly on your countertop.',
      specifications: JSON.stringify({ Brand: 'Instant Pot', Model: 'Duo', Capacity: '6 Quart', Programs: '13 One-Touch' }),
      price: 79.95, originalPrice: 99.95, stock: 156, categorySlug: 'home-kitchen', rating: 4.7, reviewCount: 156789, isPrime: true,
      images: [{ url: '/images/instant_pot_duo_1774727335652.png', primary: true }],
    },
    {
      name: 'Keurig K-Elite Coffee Maker',
      description: 'The elegant Keurig K-Elite single-serve coffee maker powerfully blends an exclusively premium brushed metallic finish with highly programmable features to deliver the ultimate customizable beverage experience. Not only does it brew incredibly robust hot coffee seamlessly by tapping into the Strong Brew setting, but it also features a dedicated Iced button—instantly brewing hot coffee directly over ice at exactly the right potency for a full-flavored chilled drink! The massive 75oz removable water reservoir drastically cuts down on refill disruptions throughout the workweek. Experience genuine barista convenience at home.',
      specifications: JSON.stringify({ Brand: 'Keurig', Type: 'Single Serve', 'Reservoir Size': '75 oz', Features: 'Iced Setting, Strong Brew' }),
      price: 149.00, originalPrice: 189.99, stock: 34, categorySlug: 'home-kitchen', rating: 4.7, reviewCount: 12345, isPrime: true,
      images: [{ url: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=600&h=600&fit=crop', primary: true }],
    },
    // ---- SPORTS ----
    {
      name: 'Fitbit Charge 6 Fitness Tracker',
      description: 'Optimize, trace, and conquer your physical routine with the cutting-edge Fitbit Charge 6. This is the only dedicated fitness tracker incorporating native Google ecosystem features straight to your wrist! Accurately monitor your precise heart rhythm throughout the day via advanced SpO2 tracking algorithms and real-time ECG assessments. The built-in heavy-duty GPS precisely tracks your outdoor runs without requiring you to tether to a smartphone. Evaluate your exercise efficiency via the robust workout intensity maps synced natively with your personalized health dashboard. The impressive 7-day battery removes constant charging anxiety.',
      specifications: JSON.stringify({ Brand: 'Fitbit', Model: 'Charge 6', Battery: '7 Days', GPS: 'Built-in', Sensors: 'HR, SpO2, ECG' }),
      price: 139.95, originalPrice: 159.95, stock: 56, categorySlug: 'sports-outdoors', rating: 4.5, reviewCount: 3421, isPrime: true,
      images: [{ url: '/images/fitbit_charge_6_1774727303761.png', primary: true }],
    },
    {
      name: 'YETI Rambler 30 oz Tumbler',
      description: 'Dramatically upgrade your beverage hydration standards. With the impossibly sturdy Rambler 30 oz Tumbler, your drinks will stay definitively ice cold or scaldingly hot far longer than standard consumer cups. YETI has aggressively over-engineered these mammoth double-wall insulated tumblers utilizing kitchen-grade 18/8 premium stainless steel bodies, natively piercing through drops, dents, and extreme chaotic rust exposure. The patented MagSlider lid brilliantly incorporates magnet mechanics to lock in temperature reliably, ensuring zero spillage or temperature bleed against prolonged outdoor exposure. Perfectly dimensioned for standard vehicle cup holders.',
      specifications: JSON.stringify({ Brand: 'YETI', Capacity: '30 oz', Material: 'Stainless Steel', Insulation: 'Double-wall vacuum' }),
      price: 42.00, originalPrice: 42.00, stock: 230, categorySlug: 'sports-outdoors', rating: 4.8, reviewCount: 45678, isPrime: true,
      images: [{ url: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=600&h=600&fit=crop', primary: true }],
    },
    // ---- CLOTHING ----
    {
      name: "Levi's Men's 511 Slim Fit Jeans",
      description: 'The definitive silhouette for modern styling. The Levi\'s 511 Slim Fit Jeans perfectly fuse an aggressively tailored, slim profile with functional movement space. Historically sitting comfortably below the natural waistline with an authentic lean cut extending sharply from the hip through the ankle, these jeans seamlessly transition between a relaxed weekend uniform to a sharp evening ensemble. Developed with a high-end 99% Cotton and 1% Elastane mixture, the extremely durable fabric provides subtle foundational stretch ensuring you never feel constricted whether sitting or walking. One of the best pieces of clothes and apparel available today.',
      specifications: JSON.stringify({ Brand: "Levi's", Material: '99% Cotton, 1% Elastane', Fit: 'Slim', Closure: 'Zipper' }),
      price: 59.50, originalPrice: 69.50, stock: 89, categorySlug: 'clothing', rating: 4.4, reviewCount: 15432, isPrime: true,
      images: [{ url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&h=600&fit=crop', primary: true }],
    },
    {
      name: 'Adidas Essentials French Terry 3-Stripes Hoodie',
      description: 'An indisputable athleisure classic universally recognized for uncompromising daily comfort. This genuine Adidas hoodie is spun from exceptionally soft 100% French terry cotton fabric specifically cultivated to deliver breathable warmth. It authentically features the globally iconic serrated 3-Stripes rushing dynamically down both sleeves, representing timeless sporting heritage. Featuring a cleanly integrated kangaroo pocket to secure your hands and valuables instantly. Easily layered or worn independently, this essential outerwear outerwear fits any clothes or fashion style, maintaining perfect structure and supreme softness through limitless spin cycles.',
      specifications: JSON.stringify({ Brand: 'Adidas', Material: '100% Cotton French Terry', Style: 'Hooded', Padding: 'None' }),
      price: 45.00, originalPrice: 55.00, stock: 120, categorySlug: 'clothing', rating: 4.5, reviewCount: 6543, isPrime: true,
      images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', primary: true }],
    },
    {
      name: 'Nike Air Max 270 Running Shoes',
      description: 'Step into legendary comfort with the Nike Air Max 270. Featuring the first-ever Max Air unit designed specifically for Nike Sportswear, these shoes deliver an ultra-plush, highly responsive ride that feels as good as it looks. The sleek, running-inspired design is perfect for both casual streetwear and intensive physical activity. The woven and synthetic fabric on the upper provides a lightweight fit with exceptional breathability. Ensure your clothes match the absolute peak of athletic footwear fashion.',
      specifications: JSON.stringify({ Brand: 'Nike', Model: 'Air Max 270', Material: 'Synthetic and Mesh', Type: 'Running Shoes' }),
      price: 150.00, originalPrice: 160.00, stock: 45, categorySlug: 'clothing', rating: 4.8, reviewCount: 8900, isPrime: true,
      images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', primary: true }],
    },
    // ---- BOOKS ----
    {
      name: 'Atomic Habits by James Clear',
      description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. If you\'re having trouble changing your habits, the problem isn\'t you. The problem is your system. Bad habits repeat themselves not because you don\'t want to change, but because you have the wrong system for change.',
      specifications: JSON.stringify({ Author: 'James Clear', Format: 'Hardcover', Pages: 320, Publisher: 'Avery' }),
      price: 13.99, originalPrice: 27.00, stock: 340, categorySlug: 'books', rating: 4.9, reviewCount: 105670, isPrime: true,
      images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=600&fit=crop', primary: true }],
    },
];

for(let prod of products) {
  prod.price = Math.round(prod.price * 83);
  if(prod.originalPrice) prod.originalPrice = Math.round(prod.originalPrice * 83);
}

async function seed() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to seed database...');

    // 1. Create default user
    const hashedPassword = await bcrypt.hash('password123', 12);
    await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
      ['Default User', 'default@amazon-clone.com', hashedPassword]
    );
    console.log('User created.');

    // 2. Create categories and store IDs
    const categoryIds = {};
    for (const cat of categoryData) {
      const res = await client.query(
        'INSERT INTO categories (name, slug, image_url) VALUES ($1, $2, $3) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url RETURNING id',
        [cat.name, cat.slug, cat.imageUrl]
      );
      categoryIds[cat.slug] = res.rows[0].id;
      console.log(`Category created: ${cat.name}`);
    }

    // 3. Create products and images
    for (const prod of products) {
      const res = await client.query(
        `INSERT INTO products (name, description, specifications, price, original_price, stock, category_id, rating, review_count, is_prime) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [prod.name, prod.description, prod.specifications, prod.price, prod.originalPrice, prod.stock, categoryIds[prod.categorySlug], prod.rating, prod.reviewCount, prod.isPrime]
      );
      const productId = res.rows[0].id;

      for (let i = 0; i < prod.images.length; i++) {
        const img = prod.images[i];
        await client.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ($1, $2, $3, $4)',
          [productId, img.url, img.primary, i]
        );
      }
      console.log(`Product created: ${prod.name}`);
    }

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
