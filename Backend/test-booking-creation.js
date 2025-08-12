const prisma = require('./config/database');

async function testBookingCreation() {
    try {
        console.log('🔍 Testing booking creation via service...');
        
        const bookingService = require('./services/bookingService');
        
        // First, let's create a test user with unique email
        const testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: `test-${Date.now()}@example.com`,
                password: 'hashedpassword',
                accountType: 'USER'
            }
        });

        console.log('👤 Created test user:', testUser.id);

        // Create a test station with unique ID
        const testStation = await prisma.station.create({
            data: {
                id: `station-${Date.now()}`,
                name: 'Test Station',
                ownerType: 'INDIVIDUAL',
                ownerId: testUser.id,
                address: 'Test Address',
                latitude: 12.9716,
                longitude: 77.5946,
                totalSlots: 10,
                availableSlots: 5
            }
        });

        console.log('🏢 Created test station:', testStation.id);

        // Test booking creation with unique slot ID
        const uniqueSlotId = `P4-${Date.now()}`;
        const booking = await bookingService.createBooking(
            testUser.id,
            testStation.id,
            null, // No EV ID - should create temp EV
            uniqueSlotId,
            new Date(Date.now() + 1 * 60 * 1000).toISOString(), // Start 1 minute from now
            new Date(Date.now() + 31 * 60 * 1000).toISOString(), // End 31 minutes from now
            {
                estimatedCost: 432,
                batteryLevel: 20,
                portType: 'CCS'
            }
        );

        console.log('✅ Booking created successfully:', booking);
        
        // Clean up
        await prisma.booking.delete({ where: { id: booking.id } });
        await prisma.chargingSlot.deleteMany({ where: { stationId: testStation.id } });
        await prisma.eV.deleteMany({ where: { userId: testUser.id } });
        await prisma.station.delete({ where: { id: testStation.id } });
        await prisma.user.delete({ where: { id: testUser.id } });
        
        console.log('🧹 Test data cleaned up');
        
    } catch (error) {
        console.error('❌ Error testing booking creation:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        });
    } finally {
        await prisma.$disconnect();
    }
}

testBookingCreation();