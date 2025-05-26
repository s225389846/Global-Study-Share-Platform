const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
  reason: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
