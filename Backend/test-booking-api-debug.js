const axios = require('axios');

async function testBookingAPIDebug() {
    try {
        console.log('🔍 Testing booking API with authentication...');
        
        // Create a test user and get auth token
        const testUser = {
            name: 'API Test User',
            email: `apitest-${Date.now()}@example.com`,
            password: 'password123',
            accountType: 'USER'
        };
        
        console.log('👤 Creating test user...');
        const signupResponse = await axios.post('http://localhost:4000/api/auth/register', testUser);
        console.log('Signup response:', signupResponse.data);
        
        // Login to get token
        console.log('🔐 Logging in...');
        const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
            email: testUser.email,
            password: testUser.password
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Got auth token:', token ? 'Present' : 'Missing');
        
        // Test booking creation with future times
        const now = new Date();
        const startTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
        const endTime = new Date(now.getTime() + 65 * 60 * 1000); // 65 minutes from now
        
        const bookingData = {
            stationId: 1, // Send as number like frontend
            evId: null,
            slotId: `P8-${Date.now()}`, // Use unique slot ID
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            estimatedCost: 209,
            batteryLevel: 22,
            portType: 'Type2'
        };
        
        console.log('📝 Creating booking with payload:', bookingData);
        console.log('🔑 Using token:', token);
        
        const bookingResponse = await axios.post(
            'http://localhost:4000/api/bookings/create',
            bookingData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ Booking created successfully:', bookingResponse.data);
        
    } catch (error) {
        console.error('❌ Error testing booking API:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testBookingAPIDebug();