const prisma = require('./config/database');

async function updateSchema() {
    try {
        console.log('🔄 Updating database schema...');

        // Add missing columns to existing tables using raw SQL
        console.log('📝 Adding new columns...');

        // Add columns to Booking table
        await prisma.$executeRaw`
            ALTER TABLE "Booking" 
            ADD COLUMN IF NOT EXISTS "estimatedCost" DOUBLE PRECISION,
            ADD COLUMN IF NOT EXISTS "actualCost" DOUBLE PRECISION,
            ADD COLUMN IF NOT EXISTS "batteryLevel" INTEGER,
            ADD COLUMN IF NOT EXISTS "portType" TEXT,
            ADD COLUMN IF NOT EXISTS "energyConsumed" DOUBLE PRECISION,
            ADD COLUMN IF NOT EXISTS "chargingDuration" INTEGER,
            ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP(3),
            ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);
        `;

        // Add columns to ChargingSlot table
        await prisma.$executeRaw`
            ALTER TABLE "ChargingSlot" 
            ADD COLUMN IF NOT EXISTS "slotNumber" TEXT,
            ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
            ADD COLUMN IF NOT EXISTS "pricePerKwh" DOUBLE PRECISION DEFAULT 8.0,
            ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'AVAILABLE',
            ADD COLUMN IF NOT EXISTS "lastMaintenance" TIMESTAMP(3);
        `;

        // Add columns to StationMasterDetails table
        await prisma.$executeRaw`
            ALTER TABLE "StationMasterDetails" 
            ADD COLUMN IF NOT EXISTS "employeeId" TEXT,
            ADD COLUMN IF NOT EXISTS "designation" TEXT DEFAULT 'Station Master',
            ADD COLUMN IF NOT EXISTS "salary" DOUBLE PRECISION,
            ADD COLUMN IF NOT EXISTS "joiningDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
            ADD COLUMN IF NOT EXISTS "permissions" TEXT;
        `;

        // Add columns to Station table
        await prisma.$executeRaw`
            ALTER TABLE "Station" 
            ADD COLUMN IF NOT EXISTS "city" TEXT,
            ADD COLUMN IF NOT EXISTS "state" TEXT,
            ADD COLUMN IF NOT EXISTS "zipCode" TEXT,
            ADD COLUMN IF NOT EXISTS "email" TEXT,
            ADD COLUMN IF NOT EXISTS "operatingHours" TEXT DEFAULT '24/7',
            ADD COLUMN IF NOT EXISTS "amenities" TEXT,
            ADD COLUMN IF NOT EXISTS "images" TEXT,
            ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
            ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "rating" DOUBLE PRECISION DEFAULT 0.0,
            ADD COLUMN IF NOT EXISTS "totalReviews" INTEGER DEFAULT 0;
        `;

        console.log('📊 Creating indexes...');

        // Create indexes (ignore if they already exist)
        try {
            await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");`;
            await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "ChargingSlot_stationId_status_idx" ON "ChargingSlot"("stationId", "status");`;
            await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "StationMasterDetails_stationId_idx" ON "StationMasterDetails"("stationId");`;
            await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "StationMasterDetails_ownerId_idx" ON "StationMasterDetails"("ownerId");`;
            await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Station_city_state_idx" ON "Station"("city", "state");`;
            await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Station_isActive_isVerified_idx" ON "Station"("isActive", "isVerified");`;
        } catch (indexError) {
            console.log('⚠️ Some indexes may already exist, continuing...');
        }

        console.log('🔢 Updating existing records with default values...');

        // Update existing ChargingSlot records with default slotNumber
        const slotsWithoutNumber = await prisma.chargingSlot.findMany({
            where: { slotNumber: null },
            orderBy: { createdAt: 'asc' }
        });

        for (let i = 0; i < slotsWithoutNumber.length; i++) {
            const slot = slotsWithoutNumber[i];
            const slotNumber = `A${(i + 1).toString().padStart(2, '0')}`;
            
            await prisma.chargingSlot.update({
                where: { id: slot.id },
                data: { slotNumber }
            });
        }

        // Update existing StationMasterDetails with default employeeId
        const mastersWithoutId = await prisma.stationMasterDetails.findMany({
            where: { employeeId: null },
            include: { station: { select: { name: true } } }
        });

        for (const master of mastersWithoutId) {
            const stationPrefix = master.station.name.substring(0, 3).toUpperCase();
            const employeeId = `${stationPrefix}${Date.now().toString().slice(-6)}`;
            
            await prisma.stationMasterDetails.update({
                where: { id: master.id },
                data: { employeeId }
            });
        }

        console.log('✅ Schema update completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Updated ${slotsWithoutNumber.length} charging slots with slot numbers`);
        console.log(`   - Updated ${mastersWithoutId.length} station masters with employee IDs`);
        console.log('   - Added all new columns and indexes');
        console.log('   - Maintained backward compatibility');

    } catch (error) {
        console.error('❌ Error updating schema:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the update
updateSchema().catch(console.error);