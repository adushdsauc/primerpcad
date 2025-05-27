// routes/calls.js
const express = require("express");
const router = express.Router();
const Call = require("../models/Call");
const { ensureAuth } = require("../middleware/auth");

async function generateCallNumber() {
  try {
    const lastCall = await Call.findOne().sort({ callNumber: -1 });
    return lastCall && lastCall.callNumber ? lastCall.callNumber + 1 : 1001;
  } catch (err) {
    console.error("❌ Failed to generate call number:", err);
    return 1001; // fallback default
  }
}

// POST create a new call
router.post("/", ensureAuth, async (req, res) => {
  try {
    const { type, location, postal, details } = req.body;

    if (!type || !location || !postal) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const callNumber = await generateCallNumber();

    const newCall = await Call.create({
      callNumber,
      type,
      location,
      postal,
      details,
      primaryOfficer: req.user.discordId
    });

    res.status(201).json({ success: true, call: newCall });
  } catch (err) {
    console.error("Error creating call:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET all calls
router.get("/", ensureAuth, async (req, res) => {
  try {
    const calls = await Call.find().sort({ createdAt: -1 });
    res.json({ success: true, calls });
  } catch (err) {
    console.error("Error fetching calls:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
