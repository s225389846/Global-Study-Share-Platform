const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
