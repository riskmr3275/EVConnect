const prisma = require('./config/database');
const bookingService = require('./services/bookingService');

async function debugBookingError() {
    try {
        console.log('🔍 Debugging booking error with exact frontend payload...');
        
        // Create a test user first
        const testUser = await prisma.user.create({
            data: {
                name: 'Debug User',
                email: `debug-${Date.now()}@example.com`,
                password: 'hashedpassword',
                accountType: 'USER'
            }
        });

        console.log('👤 Created test user:', testUser.id);

        // Check if station with ID "1" exists
        let station = await prisma.station.findUnique({
            where: { id: '1' }
        });

        if (!station) {
            console.log('🏢 Station "1" not found, creating it...');
            station = await prisma.station.create({
                data: {
                    id: '1',
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
        }

        console.log('🏢 Station found/created:', station.id);

        // Try the exact same payload as frontend
        const bookingPayload = {
            stationId: '1', // Convert to string
            evId: null,
            slotId: 'P8',
            startTime: '2025-08-08T08:21:35.178Z',
            endTime: '2025-08-08T10:59:35.179Z',
            estimatedCost: 209,
            batteryLevel: 22,
            portType: 'Type2'
        };

        console.log('📝 Testing with payload:', bookingPayload);

        const booking = await bookingService.createBooking(
            testUser.id,
            bookingPayload.stationId,
            bookingPayload.evId,
            bookingPayload.slotId,
            bookingPayload.startTime,
            bookingPayload.endTime,
            {
                estimatedCost: bookingPayload.estimatedCost,
                batteryLevel: bookingPayload.batteryLevel,
                portType: bookingPayload.portType
            }
        );

        console.log('✅ Booking created successfully:', booking);

        // Clean up
        await prisma.booking.delete({ where: { id: booking.id } });
        await prisma.chargingSlot.deleteMany({ where: { stationId: station.id } });
        await prisma.eV.deleteMany({ where: { userId: testUser.id } });
        await prisma.user.delete({ where: { id: testUser.id } });
        
        console.log('🧹 Cleanup completed');

    } catch (error) {
        console.error('❌ Error debugging booking:', error);
        console.error('Error stack:', error.stack);
        
        // Additional debugging info
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.meta) {
            console.error('Error meta:', error.meta);
        }
    } finally {
        await prisma.$disconnect();
    }
}

debugBookingError();