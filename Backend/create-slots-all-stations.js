const prisma = require('./config/database');

async function createSlotsForAllStations() {
  try {
    console.log('Creating charging slots for all stations...');
    
    // Get all stations
    const stations = await prisma.station.findMany();
    
    if (stations.length === 0) {
      console.log('❌ No stations found');
      return;
    }
    
    console.log(`✅ Found ${stations.length} stations`);
    
    for (const station of stations) {
      console.log(`\n📍 Processing station: ${station.name}`);
      
      // Check if station already has slots
      const existingSlots = await prisma.chargingSlot.count({
        where: { stationId: station.id }
      });
      
      if (existingSlots > 0) {
        console.log(`  ⚠️  Station already has ${existingSlots} slots, skipping...`);
        continue;
      }
      
      // Create charging slots for this station
      const slotsToCreate = [
        {
          stationId: station.id,
          isOccupied: false,
          powerLevel: 50,
          type: 'CCS2_DC'
        },
        {
          stationId: station.id,
          isOccupied: false,
          powerLevel: 22,
          type: 'TYPE_2_AC'
        },
        {
          stationId: station.id,
          isOccupied: false,
          powerLevel: 150,
          type: 'CCS2_DC'
        },
        {
          stationId: station.id,
          isOccupied: false,
          powerLevel: 11,
          type: 'TYPE_2_AC'
        },
        {
          stationId: station.id,
          isOccupied: false,
          powerLevel: 75,
          type: 'CHADEMO'
        }
      ];
      
      let createdCount = 0;
      for (const slotData of slotsToCreate) {
        try {
          const slot = await prisma.chargingSlot.create({
            data: slotData
          });
          console.log(`  ✅ Created slot: ${slot.type} (${slot.powerLevel}kW)`);
          createdCount++;
        } catch (error) {
          console.log(`  ❌ Failed to create slot: ${error.message}`);
        }
      }
      
      // Update station slots count
      const totalSlots = await prisma.chargingSlot.count({
        where: { stationId: station.id }
      });
      
      const availableSlots = await prisma.chargingSlot.count({
        where: { 
          stationId: station.id,
          isOccupied: false
        }
      });
      
      await prisma.station.update({
        where: { id: station.id },
        data: {
          totalSlots: totalSlots,
          availableSlots: availableSlots
        }
      });
      
      console.log(`  ✅ Updated station: ${totalSlots} total, ${availableSlots} available`);
    }
    
    console.log('\n🎉 Finished creating slots for all stations!');
    
  } catch (error) {
    console.error('❌ Error creating slots:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSlotsForAllStations();