const axios = require('axios');
const fallbackGeocodingService = require('./fallbackGeocodingService');

class GeocodingService {
    constructor() {
        this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
        this.userAgent = 'EVConnect/1.0 (contact@evconnect.com)'; // Required by Nominatim
    }

    // Geocode address to coordinates
    async geocodeAddress(address) {
        try {
            console.log(`🔍 Geocoding address: ${address}`);
            
            const response = await axios.get(`${this.nominatimBaseUrl}/search`, {
                params: {
                    format: 'json',
                    q: address,
                    limit: 1,
                    addressdetails: 1
                },
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 10000
            });

            console.log(`📍 Geocoding response status: ${response.status}`);
            console.log(`📍 Geocoding response data length: ${response.data?.length || 0}`);

            if (response.data && response.data.length > 0) {
                const result = response.data[0];
                const geocodedResult = {
                    latitude: parseFloat(result.lat),
                    longitude: parseFloat(result.lon),
                    displayName: result.display_name,
                    address: result.address || {}
                };
                
                console.log(`✅ Geocoding successful:`, geocodedResult);
                return geocodedResult;
            } else {
                console.log(`❌ No results found for address: ${address}`);
                throw new Error('Location not found');
            }
        } catch (error) {
            console.error('❌ Geocoding error:', {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
            
            // Try fallback service for Indian cities
            console.log('🔄 Trying fallback geocoding service...');
            try {
                const fallbackResult = await fallbackGeocodingService.geocodeAddress(address);
                console.log('✅ Fallback geocoding successful:', fallbackResult);
                return fallbackResult;
            } catch (fallbackError) {
                console.log('❌ Fallback geocoding also failed:', fallbackError.message);
            }
            
            // Return appropriate error based on original error
            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                throw new Error('Network connection error. Please check your internet connection.');
            } else if (error.response?.status === 403) {
                throw new Error('Geocoding service access denied. Please check API configuration.');
            } else if (error.response?.status === 429) {
                throw new Error('Too many requests. Please try again later.');
            } else {
                throw new Error(`Failed to geocode address: ${error.message}`);
            }
        }
    }

    // Reverse geocode coordinates to address
    async reverseGeocode(latitude, longitude) {
        try {
            const response = await axios.get(`${this.nominatimBaseUrl}/reverse`, {
                params: {
                    format: 'json',
                    lat: latitude,
                    lon: longitude,
                    addressdetails: 1
                },
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 10000
            });

            if (response.data) {
                return {
                    displayName: response.data.display_name,
                    address: response.data.address || {}
                };
            } else {
                throw new Error('Address not found');
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error.message);
            throw new Error('Failed to reverse geocode coordinates');
        }
    }

    // Get nearby places
    async getNearbyPlaces(latitude, longitude, radius = 1000) {
        try {
            // This is a simplified implementation
            // In a real app, you might want to use a more comprehensive places API
            const response = await axios.get(`${this.nominatimBaseUrl}/search`, {
                params: {
                    format: 'json',
                    lat: latitude,
                    lon: longitude,
                    addressdetails: 1,
                    limit: 10
                },
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 10000
            });

            return response.data.map(place => ({
                name: place.display_name,
                latitude: parseFloat(place.lat),
                longitude: parseFloat(place.lon),
                address: place.address || {}
            }));
        } catch (error) {
            console.error('Nearby places error:', error.message);
            throw new Error('Failed to fetch nearby places');
        }
    }

    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        return Math.round(distance * 100) / 100; // Round to 2 decimal places
    }

    // Helper method to convert degrees to radians
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Validate coordinates
    isValidCoordinates(latitude, longitude) {
        return (
            typeof latitude === 'number' &&
            typeof longitude === 'number' &&
            latitude >= -90 && latitude <= 90 &&
            longitude >= -180 && longitude <= 180
        );
    }
}

module.exports = new GeocodingService();