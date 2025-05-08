// Load environment variables from the .env file
require("dotenv").config();

// Import necessary libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

// Check if the MongoDB URI is available
if (!mongoUri) {
  console.error("MongoDB URI is not defined in .env file.");
  process.exit(1); // Exit the application if no URI is found
}

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Basic route for testing the API
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Define your routes (you can add more routes below)
app.use("/api/auth", require("./routes/auth")); // Example auth route (will be created later)
app.use("/api/users", require("./routes/users")); // Example user route (will be created later)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
