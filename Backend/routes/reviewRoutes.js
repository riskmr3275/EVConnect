const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, isUser } = require('../middlewares/Auth');

// Create a new review
router.post('/create', auth, isUser, reviewController.createReview);

// Get station reviews
router.get('/station/:stationId', reviewController.getStationReviews);

// Get user reviews
router.get('/user-reviews', auth, isUser, reviewController.getUserReviews);

// Update review
router.put('/:reviewId', auth, isUser, reviewController.updateReview);

// Delete review
router.delete('/:reviewId', auth, isUser, reviewController.deleteReview);

// Get review statistics for station owner
router.get('/stats/:stationId', auth, reviewController.getReviewStats);

// Get top rated stations
router.get('/top-rated', reviewController.getTopRatedStations);

module.exports = router;