// Step 1: MongoDB model - models/ClockLog.js
const mongoose = require("mongoose");

const ClockLogSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  officerName: { type: String, required: true },
  callsign: { type: String, required: true },
  department: { type: String, required: true }, // Xbox or PlayStation
  clockInTime: { type: Date, required: true },
  clockOutTime: { type: Date },
  duration: { type: Number }, // in seconds
}, { timestamps: true });

module.exports = mongoose.model("ClockSession", ClockLogSchema);
