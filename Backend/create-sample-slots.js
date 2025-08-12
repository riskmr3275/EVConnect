const prisma = require('./config/database');

async function createSampleSlots() {
  try {
    console.log('Creating sample charging slots...');
    
    // Get the first station
    const station = await prisma.station.findFirst();
    
    if (!station) {
      console.log('❌ No stations found');
      return;
    }
    
    console.log(`✅ Using station: ${station.name}`);
    
    // Create some charging slots
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
      }
    ];
    
    for (const slotData of slotsToCreate) {
      const slot = await prisma.chargingSlot.create({
        data: slotData
      });
      console.log(`✅ Created slot: ${slot.id} (${slot.type}, ${slot.powerLevel}kW)`);
    }
    
    // Update station available slots count
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
    
    console.log(`✅ Updated station: ${totalSlots} total slots, ${availableSlots} available`);
    
  } catch (error) {
    console.error('❌ Error creating slots:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleSlots();