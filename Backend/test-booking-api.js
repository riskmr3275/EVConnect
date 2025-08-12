const axios = require('axios');

async function testBookingAPI() {
    try {
        console.log('🔍 Testing booking API endpoint...');
        
        // First, let's test if the server is running
        const healthCheck = await axios.get('http://localhost:4000/');
        console.log('✅ Server is running:', healthCheck.data.message);
        
        // Create a test user and get auth token
        const testUser = {
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            password: 'password123',
            accountType: 'USER'
        };
        
        console.log('👤 Creating test user...');
        const signupResponse = await axios.post('http://localhost:4000/api/auth/register', testUser);
        console.log('User created:', signupResponse.data.success);
        
        // Login to get token
        const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
            email: testUser.email,
            password: testUser.password
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Got auth token');
        
        // Test booking creation
        const bookingData = {
            stationId: '1',
            evId: null,
            slotId: `P4-${Date.now()}`,
            startTime: new Date(Date.now() + 1 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() + 31 * 60 * 1000).toISOString(),
            estimatedCost: 432,
            batteryLevel: 20,
            portType: 'CCS'
        };
        
        console.log('📝 Creating booking...');
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
        console.error('❌ Error testing booking API:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

testBookingAPI();