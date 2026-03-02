const { readData, writeData } = require('../utils/file.util');
const path = require('path');

const wishlistFilePath = path.join(__dirname, '../../data/wishlist.json');

// Helper to get or init user wishlist
const getUserWishlist = (userId, data) => {
    let userRecord = data.find(w => w.userId === userId);
    if (!userRecord) {
        userRecord = { userId, items: [] };
        data.push(userRecord);
    }
    return userRecord;
};

// GET WISHLIST
exports.getWishlist = (req, res) => {
    try {
        const { userId } = req.params;
        const data = readData(wishlistFilePath);
        const userWishlist = getUserWishlist(userId, data);

        res.status(200).json(userWishlist.items);
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// TOGGLE WISHLIST (Add or Remove)
exports.toggleWishlist = (req, res) => {
    try {
        const { userId, product } = req.body;

        if (!userId || !product || !product.id) {
            return res.status(400).json({ message: "User ID and Product are required" });
        }

        const data = readData(wishlistFilePath);
        const userRecord = getUserWishlist(userId, data);

        const existingIndex = userRecord.items.findIndex(p => p.id === product.id);

        let action = "";
        // If it exists, remove it. If it doesn't, add it.
        if (existingIndex >= 0) {
            userRecord.items.splice(existingIndex, 1);
            action = "removed";
        } else {
            userRecord.items.push(product);
            action = "added";
        }

        writeData(wishlistFilePath, data);

        res.status(200).json({
            message: `Product ${action} successfully`,
            action: action,
            items: userRecord.items
        });

    } catch (error) {
        console.error("Toggle wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
