const prisma = require("../config/database");

class ReviewService {
    // Create a new review
    async createReview(userId, stationId, rating, comment) {
        try {
            // Validate rating
            if (rating < 1 || rating > 5) {
                throw new Error("Rating must be between 1 and 5");
            }

            // Check if station exists
            const station = await prisma.station.findUnique({
                where: { id: stationId }
            });

            if (!station) {
                throw new Error("Station not found");
            }

            // Check if user has completed a booking at this station
            const completedBooking = await prisma.booking.findFirst({
                where: {
                    userId,
                    stationId,
                    status: 'CHARGING_DONE'
                }
            });

            if (!completedBooking) {
                throw new Error("You can only review stations where you have completed a charging session");
            }

            // Check if user has already reviewed this station
            const existingReview = await prisma.review.findFirst({
                where: {
                    userId,
                    stationId
                }
            });

            if (existingReview) {
                throw new Error("You have already reviewed this station");
            }

            // Create the review
            const review = await prisma.review.create({
                data: {
                    userId,
                    stationId,
                    rating,
                    comment: comment || ""
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                }
            });

            // Update station's average rating
            await this.updateStationRating(stationId);

            return review;
        } catch (error) {
            console.error("Error creating review:", error);
            throw new Error(error.message || "Failed to create review");
        }
    }

    // Get station reviews with pagination
    async getStationReviews(stationId, page = 1, limit = 10, sortBy = 'newest') {
        try {
            const skip = (page - 1) * limit;

            let orderBy = { createdAt: 'desc' }; // newest
            if (sortBy === 'oldest') {
                orderBy = { createdAt: 'asc' };
            } else if (sortBy === 'highest') {
                orderBy = { rating: 'desc' };
            } else if (sortBy === 'lowest') {
                orderBy = { rating: 'asc' };
            }

            const [reviews, total] = await Promise.all([
                prisma.review.findMany({
                    where: { stationId },
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy,
                    skip,
                    take: limit
                }),
                prisma.review.count({ where: { stationId } })
            ]);

            // Get review summary
            const summary = await this.getReviewSummary(stationId);

            return {
                data: reviews,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                summary
            };
        } catch (error) {
            console.error("Error fetching station reviews:", error);
            throw new Error("Failed to fetch station reviews");
        }
    }

    // Get user reviews
    async getUserReviews(userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const [reviews, total] = await Promise.all([
                prisma.review.findMany({
                    where: { userId },
                    include: {
                        station: {
                            select: {
                                name: true,
                                address: true,
                                image: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.review.count({ where: { userId } })
            ]);

            return {
                data: reviews,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            throw new Error("Failed to fetch user reviews");
        }
    }

    // Update review
    async updateReview(reviewId, userId, updateData) {
        try {
            const review = await prisma.review.findUnique({
                where: { id: reviewId }
            });

            if (!review || review.userId !== userId) {
                throw new Error("Review not found or unauthorized");
            }

            // Validate rating if provided
            if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
                throw new Error("Rating must be between 1 and 5");
            }

            const updatedReview = await prisma.review.update({
                where: { id: reviewId },
                data: updateData,
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    },
                    station: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            // Update station's average rating if rating changed
            if (updateData.rating) {
                await this.updateStationRating(review.stationId);
            }

            return updatedReview;
        } catch (error) {
            console.error("Error updating review:", error);
            throw new Error(error.message || "Failed to update review");
        }
    }

    // Delete review
    async deleteReview(reviewId, userId) {
        try {
            const review = await prisma.review.findUnique({
                where: { id: reviewId }
            });

            if (!review || review.userId !== userId) {
                throw new Error("Review not found or unauthorized");
            }

            await prisma.review.delete({
                where: { id: reviewId }
            });

            // Update station's average rating
            await this.updateStationRating(review.stationId);

            return true;
        } catch (error) {
            console.error("Error deleting review:", error);
            throw new Error("Failed to delete review");
        }
    }

    // Get review statistics for station
    async getReviewStats(stationId, userId) {
        try {
            // Verify user owns the station
            const station = await prisma.station.findUnique({
                where: { id: stationId }
            });

            if (!station || station.ownerId !== userId) {
                throw new Error("Station not found or unauthorized");
            }

            const [summary, ratingDistribution, recentReviews] = await Promise.all([
                this.getReviewSummary(stationId),
                this.getRatingDistribution(stationId),
                prisma.review.findMany({
                    where: { stationId },
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                })
            ]);

            return {
                summary,
                ratingDistribution,
                recentReviews
            };
        } catch (error) {
            console.error("Error fetching review stats:", error);
            throw new Error("Failed to fetch review statistics");
        }
    }

    // Get top rated stations
    async getTopRatedStations(limit = 10, city, minRating = 4.0) {
        try {
            const whereClause = {
                ...(city && {
                    address: {
                        contains: city,
                        mode: 'insensitive'
                    }
                })
            };

            // Get stations with their review data
            const stations = await prisma.station.findMany({
                where: whereClause,
                include: {
                    reviews: {
                        select: {
                            rating: true
                        }
                    },
                    _count: {
                        select: {
                            reviews: true
                        }
                    }
                }
            });

            // Calculate average ratings and filter
            const stationsWithRatings = stations
                .map(station => {
                    const totalRating = station.reviews.reduce((sum, review) => sum + review.rating, 0);
                    const averageRating = station.reviews.length > 0 ? totalRating / station.reviews.length : 0;

                    return {
                        ...station,
                        averageRating: Math.round(averageRating * 10) / 10,
                        reviewCount: station._count.reviews
                    };
                })
                .filter(station => station.averageRating >= minRating && station.reviewCount >= 3)
                .sort((a, b) => {
                    // Sort by rating first, then by review count
                    if (b.averageRating !== a.averageRating) {
                        return b.averageRating - a.averageRating;
                    }
                    return b.reviewCount - a.reviewCount;
                })
                .slice(0, limit);

            // Clean up the response
            return stationsWithRatings.map(station => ({
                id: station.id,
                name: station.name,
                address: station.address,
                latitude: station.latitude,
                longitude: station.longitude,
                totalSlots: station.totalSlots,
                availableSlots: station.availableSlots,
                averageRating: station.averageRating,
                reviewCount: station.reviewCount
            }));
        } catch (error) {
            console.error("Error fetching top rated stations:", error);
            throw new Error("Failed to fetch top rated stations");
        }
    }

    // Helper method to update station's average rating
    async updateStationRating(stationId) {
        try {
            const result = await prisma.review.aggregate({
                where: { stationId },
                _avg: { rating: true },
                _count: { rating: true }
            });

            const averageRating = result._avg.rating || 0;
            const reviewCount = result._count.rating || 0;

            // You might want to store this in the station table
            // For now, we'll just log it
            console.log(`Station ${stationId} - Average Rating: ${averageRating}, Review Count: ${reviewCount}`);

            return { averageRating, reviewCount };
        } catch (error) {
            console.error("Error updating station rating:", error);
        }
    }

    // Helper method to get review summary
    async getReviewSummary(stationId) {
        try {
            const result = await prisma.review.aggregate({
                where: { stationId },
                _avg: { rating: true },
                _count: { rating: true }
            });

            const averageRating = result._avg.rating || 0;
            const totalReviews = result._count.rating || 0;

            return {
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews
            };
        } catch (error) {
            console.error("Error getting review summary:", error);
            return { averageRating: 0, totalReviews: 0 };
        }
    }

    // Helper method to get rating distribution
    async getRatingDistribution(stationId) {
        try {
            const distribution = await prisma.review.groupBy({
                by: ['rating'],
                where: { stationId },
                _count: { rating: true }
            });

            const result = {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0
            };

            distribution.forEach(item => {
                result[item.rating] = item._count.rating;
            });

            return result;
        } catch (error) {
            console.error("Error getting rating distribution:", error);
            return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        }
    }
}

module.exports = new ReviewService();