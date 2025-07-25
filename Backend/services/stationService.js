const prisma = require("../config/database");

class StationService {
  // Create a new station
  async createStation(data) {
    // console.log("Creating station with data:", data);
    const {
      name,
      companyName,
      ownerType,
      address,
      latitude,
      longitude,
      totalSlots,
      contact,
      user,
    } = data;
    // console.log("User data:", user);
    const newStation = await prisma.station.create({
      data: {
        name,
        companyName,
        ownerType,
        ownerId: user.userId,
        address,
        latitude: parseFloat(latitude),     // <-- convert to number
        longitude: parseFloat(longitude),
        totalSlots,
        availableSlots: totalSlots,
        contact,
        // owner: {
        //     connect: {
        //         id: user.userId, // Assuming userId is the ID of the owner
        //     },
        // },
      },
    });
    return newStation;
  }

  // Get all stations
  async getAllStations() {
    const stations = await prisma.station.findMany();
    return stations;
  }

  // Get a station by ID
  async getStationById(id) {
    const station = await prisma.station.findUnique({
      where: { id: id },
    });
    return station;
  }

  // Update a station
  async updateStation(id, updatedData) {
    const updatedStation = await prisma.station.update({
      where: { id: Number(id) },
      data: updatedData,
    });
    return updatedStation;
  }

  // Delete a station
  async deleteStation(id) {
    const deletedStation = await prisma.station.delete({
      where: { id: Number(id) },
    });
    return deletedStation;
  }

  // Get stations by location (latitude, longitude, and radius)
  async getStationsByLocation(latitude, longitude, radius) {
    // console.log("Fetching stations within radius:", radius);
    // console.log("Latitude:", latitude, "Longitude:", longitude);
    const stations = await prisma.$queryRaw`
            SELECT * FROM (
                SELECT *, 
                    (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance
                FROM "Station"
            ) AS subquery
            WHERE distance <= ${radius}
            ORDER BY distance;
        `;
    return stations;
  }
}

module.exports = new StationService();
