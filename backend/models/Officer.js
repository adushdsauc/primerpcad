// models/Officer.js
const mongoose = require("mongoose");

const OfficerSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  civilianId: { type: mongoose.Schema.Types.ObjectId, ref: "Civilian", required: true },
  department: { type: String, enum: ["Xbox", "PlayStation"], required: true },
  callsign: { type: String, required: true },
  badgeNumber: { type: Number, required: true, unique: true },
  rank: { type: String, default: "Rookie" },
  firstName: { type: String, required: true },  // ✅ Add this
  lastName: { type: String, required: true },   // ✅ And this
}, { timestamps: true });

module.exports = mongoose.model("Officer", OfficerSchema);


// routes/officers.js
const express = require("express");
const router = express.Router();
const Officer = require("../models/Officer");

// GET /api/officers/:discordId
router.get("/:discordId", async (req, res) => {
  try {
    const officer = await Officer.findOne({ discordId: req.params.discordId });
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    res.json(officer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/officers
router.post("/", async (req, res) => {
  const { discordId, civilianId, department, callsign } = req.body;
  if (!discordId || !civilianId || !department || !callsign) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Auto-generate badge number (increment based on latest entry)
    const last = await Officer.findOne({}).sort({ badgeNumber: -1 });
    const badgeNumber = last ? last.badgeNumber + 1 : 101;

    const officer = await Officer.create({
      discordId,
      civilianId,
      department,
      callsign,
      badgeNumber,
      rank: "Rookie",
    });

    res.status(201).json(officer);
  } catch (err) {
    console.error("Failed to create officer:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = mongoose.model("Officer", OfficerSchema);
