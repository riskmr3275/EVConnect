const stationService = require('../services/stationService');

class StationController {
    // Create a new station
    async createStation(req, res) {
        try {
            const { name, companyName, ownerType, address, latitude, longitude, totalSlots, contact } = req.body;
            console.log("Request body:", req.user);
            const newStation = await stationService.createStation({
                name,
                companyName,
                ownerType,
                address,
                latitude,
                longitude,
                totalSlots,
                availableSlots: totalSlots,
                contact,
                user:req.user
            });
            return res.status(201).json({ message: 'Station created successfully', data: newStation });
        } catch (error) {
            return res.status(400).json({ sucess:false,message: error.message });
        }
    }

    // Get all stations
    async getAllStations(req, res) {
        try {
            const stations = await stationService.getAllStations();
            return res.status(200).json({ message: 'Stations retrieved successfully', data: stations });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Get a station by ID
    async getStationById(req, res) {
        try {
            const { id } = req.params;
            const station = await stationService.getStationById(id);
            if (!station) {
                return res.status(404).json({ message: 'Station not found' });
            }
            return res.status(200).json({ message: 'Station retrieved successfully', data: station });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Update a station
    async updateStation(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedStation = await stationService.updateStation(id, updatedData);
            if (!updatedStation) {
                return res.status(404).json({ message: 'Station not found' });
            }
            return res.status(200).json({ message: 'Station updated successfully', data: updatedStation });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Delete a station
    async deleteStation(req, res) {
        try {
            const { id } = req.params;
            const deletedStation = await stationService.deleteStation(id);
            if (!deletedStation) {
                return res.status(404).json({ message: 'Station not found' });
            }
            return res.status(200).json({ message: 'Station deleted successfully' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Get stations by location (latitude and longitude)
    async getStationsByLocation(req, res) {
        try {
            const { latitude, longitude, radius } = req.query;
            const stations = await stationService.getStationsByLocation(latitude, longitude, radius);
            return res.status(200).json({ message: 'Stations retrieved successfully', data: stations });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new StationController();