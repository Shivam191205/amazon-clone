const { pool } = require('./src/config/db');
const fs = require('fs');

async function exportData() {
  console.log('⏳ Starting data export from PostgreSQL...');
  
  const tables = [
    'users',
    'categories',
    'products',
    'product_images',
    'cart_items',
    'orders',
    'order_items',
    'wishlist_items',
    'reviews' // Not in schema.prisma but used in productController
  ];
  
  const dump = {};

  try {
    for (const table of tables) {
      console.log(`Exporting table: ${table}...`);
      try {
        const result = await pool.query(`SELECT * FROM ${table}`);
        dump[table] = result.rows;
        console.log(`✅ Extracted ${result.rows.length} rows from ${table}`);
      } catch (err) {
        if (err.code === '42P01') {
          console.log(`⚠️ Table ${table} does not exist. Skipping.`);
          dump[table] = [];
        } else {
          throw err;
        }
      }
    }

    fs.writeFileSync('data_dump.json', JSON.stringify(dump, null, 2));
    console.log('\n🎉 Successfully exported all PostgreSQL data to data_dump.json!');
  } catch (error) {
    console.error('❌ Error during export:', error);
  } finally {
    await pool.end();
  }
}

exportData();
