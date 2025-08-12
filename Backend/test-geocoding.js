#!/usr/bin/env node

// Simple test script for geocoding service
const geocodingService = require('./services/geocodingService');
const fallbackGeocodingService = require('./services/fallbackGeocodingService');

console.log('🧪 Testing Geocoding Services...\n');

async function testFallbackService() {
    console.log('1. Testing Fallback Geocoding Service:');
    
    const testCities = ['patna', 'delhi', 'mumbai', 'bangalore', 'nonexistent'];
    
    for (const city of testCities) {
        try {
            const result = await fallbackGeocodingService.geocodeAddress(city);
            console.log(`   ✅ ${city}: ${result.latitude}, ${result.longitude}`);
        } catch (error) {
            console.log(`   ❌ ${city}: ${error.message}`);
        }
    }
    console.log();
}

async function testMainService() {
    console.log('2. Testing Main Geocoding Service (with fallback):');
    
    const testCities = ['patna', 'delhi', 'mumbai'];
    
    for (const city of testCities) {
        try {
            const result = await geocodingService.geocodeAddress(city);
            console.log(`   ✅ ${city}: ${result.latitude}, ${result.longitude} (${result.displayName})`);
        } catch (error) {
            console.log(`   ❌ ${city}: ${error.message}`);
        }
    }
    console.log();
}

async function testAvailableCities() {
    console.log('3. Available Cities Count:');
    const cities = fallbackGeocodingService.getAvailableCities();
    console.log(`   📍 Total cities in fallback database: ${cities.length}`);
    console.log(`   🏙️  Sample cities: ${cities.slice(0, 10).map(c => c.name).join(', ')}...\n`);
}

async function runTests() {
    try {
        await testFallbackService();
        await testMainService();
        await testAvailableCities();
        
        console.log('✅ All tests completed!');
        console.log('🚀 Geocoding service is ready to use.');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests
runTests();