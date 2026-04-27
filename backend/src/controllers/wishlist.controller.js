const Wishlist = require('../models/Wishlist.model');
const Product = require('../models/Product.model');

// Helper to get or create user wishlist
const getUserWishlist = async (userId) => {
    let userRecord = await Wishlist.findOne({ userId });
    if (!userRecord) {
        userRecord = new Wishlist({ userId, items: [] });
        await userRecord.save();
    }
    return userRecord;
};

// GET WISHLIST
exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const userWishlist = await getUserWishlist(userId);

        if (!userWishlist.items || userWishlist.items.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch full product details using the stored IDs
        const itemIds = userWishlist.items.map(item => item.id);
        const fullProducts = await Product.find({ id: { $in: itemIds } });

        res.status(200).json(fullProducts);
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// TOGGLE WISHLIST (Add or Remove)
exports.toggleWishlist = async (req, res) => {
    try {
        const { userId, product } = req.body;

        if (!userId || !product || !product.id) {
            return res.status(400).json({ message: "User ID and Product are required" });
        }

        const userRecord = await getUserWishlist(userId);

        const existingIndex = userRecord.items.findIndex(p => p.id === product.id);

        let action = "";
        
        if (existingIndex >= 0) {
            // If it exists, remove it
            userRecord.items.splice(existingIndex, 1);
            action = "removed";
        } else {
            // If it doesn't, add it
            userRecord.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img
            });
            action = "added";
        }

        await userRecord.save();

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
