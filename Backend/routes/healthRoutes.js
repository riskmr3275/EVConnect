const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
    const healthStatus = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: require('../package.json').version,
        services: {
            database: 'Connected', // You can add actual DB health check here
            stripe: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured',
            email: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
            cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured',
            geocoding: 'Available (with fallback)'
        }
    };

    res.status(200).json({
        success: true,
        message: 'EV Connect Backend is running!',
        data: healthStatus
    });
});

// Detailed system info (for debugging)
router.get('/system', (req, res) => {
    const systemInfo = {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
        cpu_count: require('os').cpus().length,
        load_average: require('os').loadavg(),
        free_memory: require('os').freemem(),
        total_memory: require('os').totalmem(),
    };

    res.status(200).json({
        success: true,
        system: systemInfo
    });
});

module.exports = router;