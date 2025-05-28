const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendRegistrationEmail } = require("../utils/mailer");

exports.handleRegister = async (req, res) => {
  const { name, email, password } = req.body || {};
  const errors = {};

  // Validation
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

  // Create user
  const user = new User({ name, email, password });
  await user.save();

  // Send registration email
  try {
    await sendRegistrationEmail(user.email, user.name);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  // Respond
  res.json({ data: user.toJSON(), message: "User registered successfully!" });
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    token,
    role: user.role,
    user: user.toJSON(),
  });
};

exports.handleLogout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
