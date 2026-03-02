const { readData, writeData } = require('../utils/file.util');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../../data/orders.json');
const usersFilePath = path.join(__dirname, '../../data/login.json');

// CREATE ORDER
exports.createOrder = (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: "UserId and items are required to create an order" });
        }

        const users = readData(usersFilePath);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const orders = readData(ordersFilePath);

        const newOrder = {
            orderId: Date.now().toString(),
            userId: user.id,
            customerName: user.name, // Storing customer name as requested
            items: items, // Array of items ordered
            totalAmount: totalAmount || 0,
            orderDate: new Date().toISOString(),
            status: "Processing"
        };

        orders.push(newOrder);
        writeData(ordersFilePath, orders);

        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET ORDERS BY USER ID
exports.getOrdersByUser = (req, res) => {
    try {
        const { userId } = req.params;

        const users = readData(usersFilePath);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const orders = readData(ordersFilePath);
        const userOrders = orders.filter(o => o.userId === userId);

        res.status(200).json(userOrders);

    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET ALL ORDERS (Admin/Debug)
exports.getAllOrders = (req, res) => {
    try {
        const orders = readData(ordersFilePath);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
