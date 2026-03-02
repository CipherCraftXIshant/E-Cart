const { readData, writeData } = require('../utils/file.util');
const path = require('path');

const usersFilePath = path.join(__dirname, '../../data/login.json');

// SIGNUP
exports.signup = (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const users = readData(usersFilePath);

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password // Note: In a real app we'd hash this, but we're keeping it simple for the assignment
        };

        users.push(newUser);
        writeData(usersFilePath, users);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: "Signup successful", user: userWithoutPassword });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGIN
exports.login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const users = readData(usersFilePath);

        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({ message: "Login successful", user: userWithoutPassword });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
