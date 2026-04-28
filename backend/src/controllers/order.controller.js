const Order = require('../models/Order.model');
const User = require('../models/User.model');
const socketManager = require('../socket');

// CREATE ORDER
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, shipping, payment } = req.body;

        if (!userId || !items || items.length === 0 || !shipping) {
            return res.status(400).json({ message: "UserId, items, and shipping details are required to create an order" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newOrder = new Order({
            userId,
            customerName: user.name,
            items: items,
            totalAmount: totalAmount || 0,
            shipping: shipping,
            payment: payment || 'Cash on Delivery'
        });

        await newOrder.save();

        // Notify the user in real-time that their order was placed
        try {
            const io = socketManager.getIO();
            io.to(userId.toString()).emit('order:new', {
                orderId: newOrder._id,
                status: newOrder.status,
                totalAmount: newOrder.totalAmount
            });
        } catch (_) { /* Socket not yet connected, skip */ }

        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET ORDERS BY USER ID
exports.getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userOrders = await Order.find({ userId }).sort({ orderDate: -1 });

        // Auto-update to Delivered if > 2 hours old and emit socket event
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        for (let order of userOrders) {
            if (order.status === 'Processing' && order.orderDate < twoHoursAgo) {
                await Order.updateOne({ _id: order._id }, { $set: { status: 'Delivered' } });
                order.status = 'Delivered';
                // Emit real-time update to this user's socket room
                try {
                    const io = socketManager.getIO();
                    io.to(userId.toString()).emit('order:statusUpdated', {
                        orderId: order._id,
                        status: 'Delivered'
                    });
                } catch (_) { /* Socket not ready, skip */ }
            }
        }

        res.status(200).json(userOrders);

    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET ALL ORDERS (Admin/Debug)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        
        // Auto-update to Delivered if > 2 hours old
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        for (let order of orders) {
            if (order.status === 'Processing' && order.orderDate < twoHoursAgo) {
                await Order.updateOne({ _id: order._id }, { $set: { status: 'Delivered' } });
                order.status = 'Delivered';
            }
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
