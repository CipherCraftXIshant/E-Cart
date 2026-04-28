const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_purposes';

// SIGNUP
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        // Prepare consistent user object for frontend (with string 'id')
        const userObj = newUser.toObject();
        const { password: _, _id, __v, ...userWithoutPassword } = userObj;
        userWithoutPassword.id = _id.toString();

        // Generate JWT
        const token = jwt.sign(
            { id: userWithoutPassword.id, email: userWithoutPassword.email, name: userWithoutPassword.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Store JWT in HttpOnly cookie (JS cannot read this)
        res.cookie('ecart_token', token, {
            httpOnly: true,
            secure: false,       // set to true in production (HTTPS)
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000  // 1 day
        });

        res.status(201).json({ message: "Signup successful", user: userWithoutPassword, token });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email, then securely compare hashed password
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const userObj = user.toObject();
        const { password: _, _id, __v, ...userWithoutPassword } = userObj;
        userWithoutPassword.id = _id.toString();

        // Generate JWT
        const token = jwt.sign(
            { id: userWithoutPassword.id, email: userWithoutPassword.email, name: userWithoutPassword.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Store JWT in HttpOnly cookie (JS cannot read this)
        res.cookie('ecart_token', token, {
            httpOnly: true,
            secure: false,       // set to true in production (HTTPS)
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000  // 1 day
        });

        res.status(200).json({ message: "Login successful", user: userWithoutPassword, token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, avatar },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userObj = updatedUser.toObject();
        const { password: _, _id, __v, ...userWithoutPassword } = userObj;
        userWithoutPassword.id = _id.toString();

        res.status(200).json({ message: 'Profile updated successfully', user: userWithoutPassword });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGOUT — clears the HttpOnly cookie
exports.logout = (req, res) => {
    res.clearCookie('ecart_token', { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({ message: 'Logged out successfully' });
};
