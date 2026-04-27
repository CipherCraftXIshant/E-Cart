const Product = require('../models/Product.model');

// Seed products from frontend statically into MongoDB
exports.seedProducts = async (req, res) => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ message: "Invalid products payload" });
        }

        // Clear existing products
        await Product.deleteMany({});
        
        // Insert new products
        const inserted = await Product.insertMany(products);
        
        res.status(201).json({ message: `Successfully seeded ${inserted.length} products!`, data: inserted });
    } catch (error) {
        console.error("Seed error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get products with advanced filtering and search
exports.getProducts = async (req, res) => {
    try {
        const { search, cat, minPrice, maxPrice, sort, inStockOnly, minRating } = req.query;
        
        let query = {};

        // 1. Category Filter
        if (cat) {
            query.cat = cat;
        }

        // 2. Price Range Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 3. Regex Search (allows partial word matches as you type)
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { name: regex },
                { brand: regex },
                { cat: regex },
                { desc: regex }
            ];
        }

        // 4. In Stock Filter
        if (inStockOnly === 'true') {
            query.inStock = true;
        }

        // 5. Min Rating Filter
        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        // 6. Sorting
        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else if (sort === 'newest') sortOption.createdAt = -1;
        let mongooseQuery = Product.find(query);
        
        mongooseQuery = mongooseQuery.sort(sortOption);

        if (req.query.limit) {
            mongooseQuery = mongooseQuery.limit(Number(req.query.limit));
        }
        
        const products = await mongooseQuery;

        res.status(200).json(products);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
