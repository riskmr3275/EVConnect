#!/usr/bin/env node

// Simple test script for station endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function testStationEndpoints() {
    console.log('🧪 Testing Station Endpoints...\n');

    // Test 1: Health check
    try {
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('   ✅ Health check passed');
    } catch (error) {
        console.log('   ❌ Health check failed:', error.message);
        return;
    }

    // Test 2: Get all stations
    try {
        console.log('2. Testing get all stations...');
        const allStationsResponse = await axios.get(`${BASE_URL}/stations/getAllStations`);
        console.log(`   ✅ Get all stations: ${allStationsResponse.data.data?.length || 0} stations found`);
    } catch (error) {
        console.log('   ❌ Get all stations failed:', error.response?.status, error.message);
    }

    // Test 3: Get stations by location (the one causing issues)
    try {
        console.log('3. Testing get stations by location...');
        const locationResponse = await axios.post(`${BASE_URL}/stations/getStationByLocation`, {
            latitude: 25.5941,
            longitude: 85.1376,
            radius: 100
        });
        console.log(`   ✅ Get stations by location: ${locationResponse.data.data?.length || 0} stations found`);
        console.log(`   📍 Response status: ${locationResponse.status}`);
    } catch (error) {
        console.log('   ❌ Get stations by location failed:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 4: Geocoding service
    try {
        console.log('4. Testing geocoding service...');
        const geocodingResponse = await axios.get(`${BASE_URL}/geocoding/geocode?address=Patna`);
        console.log('   ✅ Geocoding service working');
        console.log(`   📍 Coordinates: ${geocodingResponse.data.data.latitude}, ${geocodingResponse.data.data.longitude}`);
    } catch (error) {
        console.log('   ❌ Geocoding service failed:', error.response?.status, error.message);
    }

    console.log('\n🎯 Test Summary:');
    console.log('   - If all tests pass, the frontend should work correctly');
    console.log('   - If get stations by location fails, check the backend logs');
    console.log('   - Make sure the backend server is running on port 4000');
}

// Run tests
testStationEndpoints().catch(console.error);