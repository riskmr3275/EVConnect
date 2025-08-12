const geocodingService = require('../services/geocodingService');

class GeocodingController {
    // Geocode address to coordinates
    async geocodeAddress(req, res) {
        try {
            const { address } = req.query;
            
            console.log(`🌐 Geocoding request received for: ${address}`);
            
            if (!address) {
                console.log('❌ No address provided in request');
                return res.status(400).json({
                    success: false,
                    message: 'Address parameter is required'
                });
            }

            if (address.trim().length < 2) {
                console.log('❌ Address too short');
                return res.status(400).json({
                    success: false,
                    message: 'Address must be at least 2 characters long'
                });
            }

            const result = await geocodingService.geocodeAddress(address.trim());
            
            console.log('✅ Geocoding successful, sending response');
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Geocoding controller error:', error.message);
            
            // Determine appropriate status code based on error
            let statusCode = 500;
            if (error.message.includes('not found')) {
                statusCode = 404;
            } else if (error.message.includes('Network connection')) {
                statusCode = 503; // Service Unavailable
            } else if (error.message.includes('access denied')) {
                statusCode = 403;
            } else if (error.message.includes('Too many requests')) {
                statusCode = 429;
            }
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Reverse geocode coordinates to address
    async reverseGeocode(req, res) {
        try {
            const { latitude, longitude } = req.query;
            
            if (!latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitude and longitude parameters are required'
                });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (!geocodingService.isValidCoordinates(lat, lon)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid coordinates provided'
                });
            }

            const result = await geocodingService.reverseGeocode(lat, lon);
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get nearby places
    async getNearbyPlaces(req, res) {
        try {
            const { latitude, longitude, radius } = req.query;
            
            if (!latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitude and longitude parameters are required'
                });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
            const searchRadius = radius ? parseInt(radius) : 1000;

            if (!geocodingService.isValidCoordinates(lat, lon)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid coordinates provided'
                });
            }

            const places = await geocodingService.getNearbyPlaces(lat, lon, searchRadius);
            
            res.status(200).json({
                success: true,
                data: places
            });
        } catch (error) {
            console.error('Nearby places error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Calculate distance between two points
    async calculateDistance(req, res) {
        try {
            const { lat1, lon1, lat2, lon2 } = req.query;
            
            if (!lat1 || !lon1 || !lat2 || !lon2) {
                return res.status(400).json({
                    success: false,
                    message: 'All coordinate parameters (lat1, lon1, lat2, lon2) are required'
                });
            }

            const latitude1 = parseFloat(lat1);
            const longitude1 = parseFloat(lon1);
            const latitude2 = parseFloat(lat2);
            const longitude2 = parseFloat(lon2);

            if (!geocodingService.isValidCoordinates(latitude1, longitude1) ||
                !geocodingService.isValidCoordinates(latitude2, longitude2)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid coordinates provided'
                });
            }

            const distance = geocodingService.calculateDistance(
                latitude1, longitude1, latitude2, longitude2
            );
            
            res.status(200).json({
                success: true,
                data: {
                    distance: distance,
                    unit: 'kilometers'
                }
            });
        } catch (error) {
            console.error('Distance calculation error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get available cities from fallback service
    async getAvailableCities(req, res) {
        try {
            const fallbackGeocodingService = require('../services/fallbackGeocodingService');
            const cities = fallbackGeocodingService.getAvailableCities();
            
            res.status(200).json({
                success: true,
                data: cities,
                count: cities.length,
                message: 'Available cities in fallback database'
            });
        } catch (error) {
            console.error('Error fetching available cities:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new GeocodingController();