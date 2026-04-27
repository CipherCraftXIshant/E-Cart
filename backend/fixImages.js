const mongoose = require('mongoose');

const replacements = {
  // Organic Brown Rice (1kg)
  'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef58?w=500&q=80': 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80',
  // Himalayan Pink Salt (500g)
  'https://images.unsplash.com/photo-1610382297700-e40e20df2e50?w=500&q=80': 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=500&q=80',
  // Handloom Cotton Kurta
  'https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=500&q=80': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80',
  // Rose Hip Face Serum
  'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=80': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
  // Matte Lipstick Set (6 Shades)
  'https://images.unsplash.com/photo-1586495777744-4e6232bf2f38?w=500&q=80': 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f38?w=500&q=80', // Replace below if still fails
  // Cotton Waffle Throw Blanket
  'https://images.unsplash.com/photo-1580237072353-751a8a5b2561?w=500&q=80': 'https://images.unsplash.com/photo-1580237072353-751a8a5b2561?w=500&q=80',
  // Cast Iron Cookware Set
  'https://images.unsplash.com/photo-1584990347449-a2d4c2c044c9?w=500&q=80': 'https://images.unsplash.com/photo-1584990347449-a2d4c2c044c9?w=500&q=80'
};

const workingUrls = [
    'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80', // rice
    'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=500&q=80', // salt
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80', // clothing
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', // face serum
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&q=80', // lipstick
    'https://images.unsplash.com/photo-1580237072353-751a8a5b2561?w=500&q=80', // blanket
    'https://images.unsplash.com/photo-1584990347449-a2d4c2c044c9?w=500&q=80' // cookware
];

mongoose.connect('mongodb://127.0.0.1:27017/ecart').then(async () => {
    const Product = require('./src/models/Product.model');
    const badUrls = Object.keys(replacements);
    const p = await Product.find({ img: { $in: badUrls } });
    
    for (const item of p) {
        console.log(`Fixing ${item.name}`);
        if (item.name.includes("Lipstick")) item.img = 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&q=80';
        else if (item.name.includes("Blanket")) item.img = 'https://images.unsplash.com/photo-1621272036047-bf0eb92f763a?w=500&q=80';
        else if (item.name.includes("Cookware")) item.img = 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500&q=80';
        else item.img = replacements[item.img] || item.img;
        
        await item.save();
    }
    console.log("Images fixed in database.");
    mongoose.disconnect();
});
