require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const seedSuperAdmin = require("./seeders/admin");
const http = require("http");
const socketio = require("./socket"); // ⭐ MODIFIED: Import the new socket.js

// ... (keep all your existing controller and middleware imports as they are) ...
const {
  handleLogin,
  handleLogout,
  handleRegister,
} = require("./controllers/authController");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionDetails,
  addQuestionReport,
} = require("./controllers/questionController");
const isAuthenticated = require("./middlewares/isAuthenticated");
const { // Keep these imports as they are
  createAnswer,
  updateAnswer,
  deleteAnswer,
} = require("./controllers/answerController");
const {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getUserDetails,
} = require("./controllers/userController");
const isSuperAdmin = require("./middlewares/isSuperAdmin");
const {
  getProfile,
  updateProfile,
} = require("./controllers/profileController");
const cors = require("cors");


const app = express();
const server = http.createServer(app); // Create HTTP server from Express app

// Initialize Socket.IO after the http server is created
const io = socketio.init(server); // ⭐ MODIFIED: Initialize socket.io here

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const extractSession = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      try {
        const user = await User.findById(decoded.id);
        req.user = user || null;
      } catch (error) {
        req.user = null;
      }
    }
    next();
  });
};
app.use(extractSession);

const router = express.Router();
app.use("/api", router);

// ************** Auth Routes **************
router.post("/auth/logout", handleLogout);
router.post("/auth/register", handleRegister);
router.post("/auth/login", handleLogin);

// ************** Question Routes **************
router.get("/questions", getQuestions);
router.get("/questions/:id", getQuestionDetails);
router.post("/questions", isAuthenticated, createQuestion);
router.put("/questions/:id", isAuthenticated, updateQuestion);
router.delete("/questions/:id", isAuthenticated, deleteQuestion);
router.post("/questions/:id/report", isAuthenticated, addQuestionReport);

// ************** Answer Routes **************
router.post("/answers", isAuthenticated, createAnswer);
router.put("/answers/:id", isAuthenticated, updateAnswer);
router.delete("/answers/:id", isAuthenticated, deleteAnswer);

// ************** User Routes **************
router.get("/users", isAuthenticated, getUsers);
router.get("/users/:id", isAuthenticated, getUserDetails);
router.post("/users", isAuthenticated, isSuperAdmin, createUser);
router.put("/users/:id", isAuthenticated, updateUser);
router.delete("/users/:id", isAuthenticated, deleteUser);

// ************** Profile Routes **************
router.get("/profile", isAuthenticated, getProfile);
router.post("/profile", isAuthenticated, updateProfile);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected successfully!");
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));

// Seed Super Admin after database connection is open
mongoose.connection.once("open", async () => {
  await seedSuperAdmin();
});

// module.exports.io = io; // ⭐ REMOVED: No longer exporting io from server.js directly