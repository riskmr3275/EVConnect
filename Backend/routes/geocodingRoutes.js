const express = require('express');
const router = express.Router();
const geocodingController = require('../controllers/geocodingController');

// Geocode address to coordinates
router.get('/geocode', geocodingController.geocodeAddress);

// Reverse geocode coordinates to address
router.get('/reverse', geocodingController.reverseGeocode);

// Get nearby places
router.get('/nearby', geocodingController.getNearbyPlaces);

// Calculate distance between two points
router.get('/distance', geocodingController.calculateDistance);

// Get available cities
router.get('/cities', geocodingController.getAvailableCities);

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Geocoding service is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            geocode: '/api/geocoding/geocode?address=YourAddress',
            reverse: '/api/geocoding/reverse?latitude=25.5941&longitude=85.1376',
            nearby: '/api/geocoding/nearby?latitude=25.5941&longitude=85.1376',
            distance: '/api/geocoding/distance?lat1=25.5941&lon1=85.1376&lat2=28.6139&lon2=77.2090',
            cities: '/api/geocoding/cities'
        }
    });
});

module.exports = router;