const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.handleRegister = async (req, res) => {
  const { name, email, password } = req.body || {};
  const errors = {};

  if (!name || name.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Valid email is required";
  } else {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.email = "Email is already registered";
    }
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const user = new User(req.body);
  await user.save();
  res.json({ data: user.toJSON(), message: "User registered successfully!" });
};
