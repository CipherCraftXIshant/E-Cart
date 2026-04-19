const Review = require('../models/Review.model');

// Get all reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const productReviews = await Review.find({ productId }).sort({ date: -1 });

        res.status(200).json(productReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add a new review
exports.addReview = async (req, res) => {
    try {
        const { productId, userId, userName, rating, text } = req.body;

        if (!productId || !userId || !userName || rating == null || !text) {
            return res.status(400).json({ message: "Incomplete review data" });
        }

        const newReview = new Review({
            productId,
            userId,
            userName,
            rating: Number(rating),
            text
        });

        await newReview.save();

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
