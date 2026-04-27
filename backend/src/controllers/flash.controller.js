const socketManager = require('../socket');

// Trigger a global flash sale — broadcasts to ALL connected users
exports.startFlashSale = async (req, res) => {
    try {
        const { discount, code, durationMinutes = 10, message } = req.body;

        if (!discount || !code) {
            return res.status(400).json({ message: 'discount and code are required' });
        }

        const io = socketManager.getIO();

        const flashData = {
            discount: Number(discount),
            code: code.toUpperCase(),
            durationMinutes: Number(durationMinutes),
            message: message || `⚡ FLASH SALE! Get ${discount}% off sitewide!`,
            endsAt: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString()
        };

        // Remember the flash sale so late-joining sockets receive it too
        socketManager.setActiveFlashSale(flashData);

        // Broadcast to every connected user
        io.emit('flashSale:start', flashData);

        // Auto-clear after the duration expires
        setTimeout(() => {
            socketManager.clearActiveFlashSale();
            io.emit('flashSale:end');
        }, durationMinutes * 60 * 1000);

        console.log(`[Flash Sale] Triggered: ${discount}% off with code ${code} for ${durationMinutes} mins`);

        res.status(200).json({ message: 'Flash sale broadcast sent!', data: flashData });
    } catch (error) {
        console.error('Flash sale error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// End flash sale early
exports.endFlashSale = async (req, res) => {
    try {
        const io = socketManager.getIO();
        io.emit('flashSale:end');
        res.status(200).json({ message: 'Flash sale ended.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
