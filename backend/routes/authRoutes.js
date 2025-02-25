const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const router = express.Router();

// Signup Endpoint
router.post("/signup", async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Login Endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      // Generate JWT using an environment variable for secret (fallback to "secret" if not set)
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
      res.json({ token, userId: user._id, name: user.name });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

// Get Users Endpoint (fetch only required fields)
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "name email phone"); // Only return these fields
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
