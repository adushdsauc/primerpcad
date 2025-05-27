const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");

// GET wallet by Discord ID
router.get("/:discordId", async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ discordId: req.params.discordId });
    
    // If wallet doesn't exist, create one with default balance
    if (!wallet) {
      wallet = await Wallet.create({ discordId: req.params.discordId });
    }

    res.json({
      success: true,
      wallet: {
        discordId: wallet.discordId,
        balance: wallet.balance
      }
    });
  } catch (err) {
    console.error("❌ Failed to fetch wallet:", err);
    res.status(500).json({ success: false, error: "Failed to fetch wallet." });
  }
});

// PUT to update wallet balance manually (optional/admin)
router.put("/:discordId", async (req, res) => {
  try {
    const { balance } = req.body;

    const updated = await Wallet.findOneAndUpdate(
      { discordId: req.params.discordId },
      { balance },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      wallet: {
        discordId: updated.discordId,
        balance: updated.balance
      }
    });
  } catch (err) {
    console.error("❌ Failed to update wallet:", err);
    res.status(500).json({ success: false, error: "Failed to update wallet." });
  }
});

module.exports = router;
