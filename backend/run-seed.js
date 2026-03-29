try {
  require('c:/Project/AmazonClone/backend/prisma/seed.js');
} catch (e) {
  require('fs').writeFileSync('c:/Project/AmazonClone/backend/err.txt', e.stack);
}
