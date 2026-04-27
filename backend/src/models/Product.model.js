const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    cat: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    old: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    img: { type: String, required: true },
    badge: { type: String },
    brand: { type: String },
    desc: { type: String },
    inStock: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Create a Text Index on name and desc for fast searching
productSchema.index({ name: 'text', desc: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
