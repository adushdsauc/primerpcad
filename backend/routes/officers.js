// routes/officers.js
const express = require("express");
const router = express.Router();
const Officer = require("../models/Officer");
const mongoose = require("mongoose");
const Civilian = mongoose.models.Civilian || require("../models/Civilian");
const { ensureAuth } = require("../middleware/auth");
const { WebhookClient, EmbedBuilder } = require("discord.js");

async function generateBadgeNumber() {
  try {
    const last = await Officer.findOne().sort({ badgeNumber: -1 });
    return last && last.badgeNumber ? last.badgeNumber + 1 : 3001;
  } catch (err) {
    console.error("❌ Failed to generate badge number:", err);
    return 3001; // Default fallback
  }
}

async function sendOfficerLog(officer, civilian) {
  try {
    const webhookURL =
      officer.department === "Xbox"
        ? process.env.LOG_WEBHOOK_XBOX
        : process.env.LOG_WEBHOOK_PLAYSTATION;

    if (!webhookURL) return;

    const webhook = new WebhookClient({ url: webhookURL });

    const embed = new EmbedBuilder()
      .setTitle("New Officer Registered")
      .setColor(officer.department === "Xbox" ? 0x5865f2 : 0xee82ee)
      .addFields(
        { name: "Civilian Name", value: `${civilian.firstName} ${civilian.lastName}`, inline: true },
        { name: "Callsign", value: officer.callsign, inline: true },
        { name: "Badge Number", value: String(officer.badgeNumber), inline: true },
        { name: "Platform", value: officer.department, inline: true },
        { name: "Rank", value: officer.rank, inline: true },
        { name: "Discord ID", value: officer.discordId, inline: false }
      )
      .setTimestamp();

    await webhook.send({ embeds: [embed] });
  } catch (err) {
    console.error("❌ Failed to send officer log:", err);
  }
}


// GET all officers
router.get("/", ensureAuth, async (req, res) => {
  try {
    const officers = await Officer.find().sort({ createdAt: -1 });
    res.json({ success: true, officers });
  } catch (err) {
    console.error("❌ Fetch officers failed:", err);
    res.status(500).json({ success: false, message: "Failed to load officers." });
  }
});

// GET officer by Discord ID
router.get("/:discordId", ensureAuth, async (req, res) => {
  try {
    const officer = await Officer.findOne({ discordId: req.params.discordId });
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    res.json(officer);
  } catch (err) {
    console.error("❌ GET /api/officers/:discordId error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new officer registration
// POST /api/officers
router.post("/", async (req, res) => {
  const { discordId, civilianId, department, callsign } = req.body;
  if (!discordId || !civilianId || !department || !callsign) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existing = await Officer.findOne({ discordId });
    if (existing) return res.status(400).json({ message: "Officer already exists" });

    const civilian = await mongoose.model("Civilian").findById(civilianId);
    if (!civilian) return res.status(404).json({ message: "Civilian not found" });

    const last = await Officer.findOne().sort({ badgeNumber: -1 });
    const badgeNumber = last ? last.badgeNumber + 1 : 101;

    const officer = await Officer.create({
      discordId,
      civilianId,
      department,
      callsign,
      badgeNumber,
      rank: "Rookie",
      firstName: civilian.firstName,
      lastName: civilian.lastName,
    });

    res.status(201).json(officer);
  } catch (err) {
    console.error("Failed to create officer:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH update officer info
router.patch("/:id", ensureAuth, async (req, res) => {
  try {
    const officer = await Officer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(officer);
  } catch (err) {
    console.error("Failed to update officer:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
