const fs = require('fs');
const path = require('path');
const { readData, writeData } = require('../utils/file.util');

const reviewsFilePath = path.join(__dirname, '../../data/reviews.json');

// Get all reviews for a specific product
exports.getReviewsByProduct = (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = readData(reviewsFilePath);

        // Filter reviews matching the product ID
        const productReviews = reviews.filter(r => r.productId === productId);

        // Return descending sorted by date (newest first)
        productReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(productReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add a new review
exports.addReview = (req, res) => {
    try {
        const { productId, userId, userName, rating, text } = req.body;

        if (!productId || !userId || !userName || rating == null || !text) {
            return res.status(400).json({ message: "Incomplete review data" });
        }

        const reviews = readData(reviewsFilePath);

        // Optional logic: we could check if user already reviewed this product,
        // but for now, we'll allow multiple or just assume one review per person.

        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
        const istDate = new Date(now.getTime() + istOffset);

        const newReview = {
            id: Date.now().toString(),
            productId,
            userId,
            userName,
            rating: Number(rating),
            text,
            date: istDate.toISOString()
        };

        reviews.push(newReview);
        writeData(reviewsFilePath, reviews);

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
