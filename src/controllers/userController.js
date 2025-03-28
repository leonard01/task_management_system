// src/controllers/userController.js
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Simple validation
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username already in use." });
    }
    
    const newUser = await User.create({ username, password });
    res.status(201).json({
      message: "User registered successfully.",
      userId: newUser._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    res.json({
      message: "Logged in successfully.",
      token,
    });
  } catch (error) {
    next(error);
  }
};
