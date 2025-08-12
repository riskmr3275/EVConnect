#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting EV Connect Backend Server...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found. Please create one from .env.example');
    console.log('📝 Run: cp .env.example .env');
    process.exit(1);
}

// Load environment variables
require('dotenv').config();

// Check critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = [];

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        missingEnvVars.push(envVar);
    }
});

if (missingEnvVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
        console.log(`   - ${envVar}`);
    });
    console.log('\n📝 Please configure these in your .env file');
    process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    const installProcess = spawn('npm', ['install'], { stdio: 'inherit' });
    
    installProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Dependencies installed successfully!');
            startServer();
        } else {
            console.log('❌ Failed to install dependencies');
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('🔥 Starting server...\n');
    
    // Start the server
    const serverProcess = spawn('node', ['index.js'], { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
    });
    
    // Handle server process events
    serverProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`\n❌ Server exited with code ${code}`);
        }
    });
    
    serverProcess.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        serverProcess.kill('SIGINT');
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down server...');
        serverProcess.kill('SIGTERM');
        process.exit(0);
    });
}