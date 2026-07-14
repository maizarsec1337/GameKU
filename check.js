const fs = require('fs');
const path = require('path');

console.log('=== CHECKING DEPENDENCIES ===');

const dirs = [
  { name: 'Root node_modules', path: path.join(__dirname, 'node_modules') },
  { name: 'Frontend node_modules', path: path.join(__dirname, 'frontend', 'node_modules') },
  { name: 'Backend node_modules', path: path.join(__dirname, 'backend', 'node_modules') }
];

dirs.forEach(d => {
  const exists = fs.existsSync(d.path);
  console.log(`${d.name}: ${exists ? '✅ INSTALLED' : '❌ MISSING'}`);
  if (exists) {
    try {
      const items = fs.readdirSync(d.path).filter(f => !f.startsWith('.'));
      console.log(`   Packages: ${items.length}`);
    } catch(e) {}
  }
});

console.log('\n=== CHECKING BUILD ===');
const distPath = path.join(__dirname, 'frontend', 'dist');
const distIndex = path.join(distPath, 'index.html');
if (fs.existsSync(distIndex)) {
  console.log('Frontend build: ✅ SUCCESS (dist/index.html exists)');
  const files = fs.readdirSync(distPath);
  console.log(`   Files: ${files.join(', ')}`);
} else {
  console.log('Frontend build: ❌ FAILED (no dist/index.html)');
}

console.log('\n=== CHECKING FILE STRUCTURE ===');
const requiredFiles = [
  'package.json',
  'build.js',
  'frontend/package.json',
  'frontend/vite.config.js',
  'frontend/index.html',
  'frontend/src/main.jsx',
  'frontend/src/App.jsx',
  'frontend/src/router.jsx',
  'frontend/src/config/assetConfig.js',
  'frontend/src/config/firebase.js',
  'frontend/src/css/theme.css',
  'frontend/src/css/app.css',
  'frontend/src/css/home.css',
  'frontend/src/css/responsive.css',
  'frontend/src/pages/Home.jsx',
  'frontend/src/pages/Login.jsx',
  'frontend/src/pages/Register.jsx',
  'frontend/src/pages/NotFound.jsx',
  'backend/package.json',
  'backend/app.js',
  'backend/server.js',
  'backend/.env',
  'backend/api/controllers/bannerController.js',
  'backend/api/controllers/categoryController.js',
  'backend/api/controllers/gameController.js',
  'backend/api/controllers/voucherController.js',
  'backend/api/controllers/promoController.js',
  'backend/api/controllers/searchController.js',
  'backend/api/controllers/authController.js',
  'backend/api/routes/banner.js',
  'backend/api/routes/category.js',
  'backend/api/routes/game.js',
  'backend/api/routes/voucher.js',
  'backend/api/routes/promo.js',
  'backend/api/routes/search.js',
  'backend/api/routes/auth.js'
];

let missing = 0;
requiredFiles.forEach(f => {
  const exists = fs.existsSync(path.join(__dirname, f));
  if (!exists) {
    console.log(`❌ MISSING: ${f}`);
    missing++;
  }
});
console.log(`\nAll files check: ${missing === 0 ? '✅ COMPLETE' : `❌ ${missing} missing`}`);

console.log('\n=== DONE ===');