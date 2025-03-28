// src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided." });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Not authorized." });
    }
    
    // Attach user to request for next middleware
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed." });
  }
};

module.exports = auth;
