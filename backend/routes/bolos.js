// routes/bolos.js
const express = require("express");
const router = express.Router();
const Bolo = require("../models/Bolo");
const { ensureAuth } = require("../middleware/auth");

// POST create a new BOLO
router.post("/", ensureAuth, async (req, res) => {
  try {
    const {
      boloType,
      vehicleDescription,
      vehiclePlate,
      personDescription,
      personName,
      location,
      details,
    } = req.body;

    if (!boloType || !location || !details) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const newBolo = await Bolo.create({
      boloType,
      vehicleDescription,
      vehiclePlate,
      personDescription,
      personName,
      location,
      details,
    });

    res.status(201).json({ success: true, bolo: newBolo });
  } catch (err) {
    console.error("Error creating BOLO:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET all BOLOs
router.get("/", ensureAuth, async (req, res) => {
  try {
    const bolos = await Bolo.find().sort({ createdAt: -1 });
    res.json({ success: true, bolos });
  } catch (err) {
    console.error("Error fetching BOLOs:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
