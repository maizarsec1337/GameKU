const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Gameku...\n');

// Step 1: Build frontend
console.log('📦 Building frontend...');
execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
console.log('✅ Frontend built successfully!\n');

// Step 2: Clear backend/public
const backendPublic = path.join(__dirname, 'backend', 'public');
if (fs.existsSync(backendPublic)) {
  fs.rmSync(backendPublic, { recursive: true, force: true });
}

// Step 3: Copy frontend/dist to backend/public
console.log('📋 Copying frontend build to backend...');
const frontendDist = path.join(__dirname, 'frontend', 'dist');
fs.cpSync(frontendDist, backendPublic, { recursive: true });
console.log('✅ Frontend copied to backend/public!\n');

// Step 4: Install backend dependencies
console.log('📦 Installing backend dependencies...');
execSync('cd backend && npm install', { stdio: 'inherit' });
console.log('✅ Backend dependencies installed!\n');

console.log('🎉 Build complete! Run "npm start" to start the server.');