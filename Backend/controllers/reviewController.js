const reviewService = require('../services/reviewService');

class ReviewController {
    // Create a new review
    async createReview(req, res) {
        try {
            const { stationId, rating, comment } = req.body;
            const userId = req.user.userId;
            
            const review = await reviewService.createReview(
                userId, 
                stationId, 
                rating, 
                comment
            );
            
            res.status(201).json({
                success: true,
                message: "Review submitted successfully",
                review
            });
        } catch (error) {
            console.error("Error creating review:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get station reviews
    async getStationReviews(req, res) {
        try {
            const { stationId } = req.params;
            const { page = 1, limit = 10, sortBy = 'newest' } = req.query;
            
            const reviews = await reviewService.getStationReviews(
                stationId, 
                parseInt(page), 
                parseInt(limit),
                sortBy
            );
            
            res.status(200).json({
                success: true,
                reviews: reviews.data,
                pagination: reviews.pagination,
                summary: reviews.summary
            });
        } catch (error) {
            console.error("Error fetching station reviews:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get user reviews
    async getUserReviews(req, res) {
        try {
            const userId = req.user.userId;
            const { page = 1, limit = 10 } = req.query;
            
            const reviews = await reviewService.getUserReviews(
                userId, 
                parseInt(page), 
                parseInt(limit)
            );
            
            res.status(200).json({
                success: true,
                reviews: reviews.data,
                pagination: reviews.pagination
            });
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Update review
    async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.user.userId;
            
            const review = await reviewService.updateReview(
                reviewId, 
                userId, 
                { rating, comment }
            );
            
            res.status(200).json({
                success: true,
                message: "Review updated successfully",
                review
            });
        } catch (error) {
            console.error("Error updating review:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Delete review
    async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const userId = req.user.userId;
            
            await reviewService.deleteReview(reviewId, userId);
            
            res.status(200).json({
                success: true,
                message: "Review deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting review:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get review statistics for station owner
    async getReviewStats(req, res) {
        try {
            const { stationId } = req.params;
            const userId = req.user.userId;
            
            const stats = await reviewService.getReviewStats(stationId, userId);
            
            res.status(200).json({
                success: true,
                stats
            });
        } catch (error) {
            console.error("Error fetching review stats:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    // Get top rated stations
    async getTopRatedStations(req, res) {
        try {
            const { limit = 10, city, minRating = 4.0 } = req.query;
            
            const stations = await reviewService.getTopRatedStations(
                parseInt(limit),
                city,
                parseFloat(minRating)
            );
            
            res.status(200).json({
                success: true,
                stations
            });
        } catch (error) {
            console.error("Error fetching top rated stations:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
}

module.exports = new ReviewController();