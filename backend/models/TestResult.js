const mongoose = require("mongoose");

const TestResultSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  licenseType: String,
  score: Number,
  passed: Boolean,
  answers: Object,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestResult", TestResultSchema);
