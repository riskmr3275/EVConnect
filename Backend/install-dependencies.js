#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Installing missing dependencies for EV Connect Backend...\n');

// Check if package.json exists
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found!');
    process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`📦 Project: ${packageJson.name} v${packageJson.version}\n`);

// List of critical dependencies that might be missing
const criticalDeps = [
    'stripe',
    'multer',
    'cloudinary',
    'node-cron',
    'nodemailer',
    'moment',
    'joi'
];

console.log('🔍 Checking critical dependencies...');
const missingDeps = [];

criticalDeps.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
        missingDeps.push(dep);
        console.log(`❌ Missing: ${dep}`);
    } else {
        console.log(`✅ Found: ${dep}`);
    }
});

if (missingDeps.length > 0) {
    console.log(`\n📥 Installing ${missingDeps.length} missing dependencies...`);
    try {
        execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
        console.log('\n✅ All dependencies installed successfully!');
    } catch (error) {
        console.error('\n❌ Failed to install dependencies:', error.message);
        process.exit(1);
    }
} else {
    console.log('\n✅ All critical dependencies are already installed!');
}

// Check environment file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('\n⚠️  .env file not found. Creating from template...');
    const envExamplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ .env file created from .env.example');
        console.log('🔧 Please configure your environment variables in .env file');
    } else {
        console.log('❌ .env.example not found. Please create .env file manually.');
    }
}

// Check database connection
console.log('\n🔍 Checking database configuration...');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not configured in .env file');
} else {
    console.log('✅ DATABASE_URL configured');
}

if (!process.env.JWT_SECRET) {
    console.log('⚠️  JWT_SECRET not configured in .env file');
} else {
    console.log('✅ JWT_SECRET configured');
}

console.log('\n🚀 Backend setup complete!');
console.log('📝 Next steps:');
console.log('   1. Configure your .env file with proper values');
console.log('   2. Run: npm run migrate (to setup database)');
console.log('   3. Run: npm run dev (to start development server)');
console.log('\n💡 For production deployment, see SETUP.md');