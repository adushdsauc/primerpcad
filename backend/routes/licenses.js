const express = require("express");
const router = express.Router();
const axios = require("axios");
const TestResult = require("../models/TestResult");
const mongoose = require("mongoose");
const Civilian = mongoose.models.Civilian || require("../models/Civilian");
const { assignLicenseRole } = require("../bot");
const { ensureAuth } = require("../middleware/auth");

const DISCORD_WEBHOOK_URL = process.env.DMV_LOG_WEBHOOK;

// ✅ Save DMV test result and assign Discord role
router.post("/save-test", ensureAuth, async (req, res) => {
  const { licenseType, score, passed, answers } = req.body;
  const user = req.user;

  if (!user || !user.discordId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Save result
    const result = await TestResult.create({
      discordId: user.discordId,
      username: user.username,
      licenseType,
      score,
      passed,
      answers
    });

    // Assign Discord role
    if (passed) {
      await assignLicenseRole(user.discordId, licenseType);
    }

    // Webhook log
    if (DISCORD_WEBHOOK_URL) {
      await axios.post(DISCORD_WEBHOOK_URL, {
        embeds: [
          {
            title: "📋 DMV Test Submitted",
            description: `**User:** <@${user.discordId}> (${user.username})\n**License Type:** ${licenseType}\n**Score:** ${score}/10\n**Result:** ${passed ? "✅ Passed" : "❌ Failed"}`,
            color: passed ? 0x57F287 : 0xED4245,
            timestamp: new Date().toISOString()
          }
        ]
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error saving test result:", err);
    return res.status(500).json({ success: false, message: "Failed to save test" });
  }
});

// ✅ Add license to civilian (used by frontend "Add License" modal)
router.post("/add-license", ensureAuth, async (req, res) => {
  const { civilianId, licenseType } = req.body;

  if (!req.user?.discordId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const civilian = await Civilian.findById(civilianId);
    if (!civilian) {
      return res.status(404).json({ success: false, message: "Civilian not found" });
    }

    if (civilian.discordId !== req.user.discordId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (civilian.licenses.includes(licenseType)) {
      return res.status(400).json({ success: false, message: "License already exists" });
    }

    civilian.licenses.push(licenseType);
    await civilian.save();

    return res.json({ success: true, civilian });
  } catch (err) {
    console.error("Add license error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
