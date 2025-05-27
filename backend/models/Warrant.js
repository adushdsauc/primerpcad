const mongoose = require("mongoose");

const WarrantSchema = new mongoose.Schema({
    civilianId: { type: mongoose.Schema.Types.ObjectId, ref: "Civilian", required: true },
    type: { type: String, enum: ["Arrest", "Search"], required: true },
    reason: { type: String, required: true },
    officerName: String,
    officerCallsign: String,
    platform: { type: String, enum: ["Xbox", "PlayStation"], required: true }, // ✅ REQUIRED
    status: { type: String, enum: ["Active", "Resolved"], default: "Active" },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
  });  

module.exports = mongoose.model("Warrant", WarrantSchema);
