const express = require("express");
const router = express.Router();
const ClockSession = require("../models/ClockSession");
const Officer = require("../models/Officer");
const Civilian = require("../models/Civilian");
const { ensureAuth } = require("../middleware/auth");
const { EmbedBuilder } = require("discord.js");
const { client } = require("../bot");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

// Platform log channel IDs
const CLOCK_LOG_CHANNELS = {
  Xbox: process.env.CLOCK_LOG_XBOX,
  PlayStation: process.env.CLOCK_LOG_PLAYSTATION,
};

// Clock-in
router.post("/in", ensureAuth, async (req, res) => {
  try {
    const discordId = req.user.discordId;

    const existing = await ClockSession.findOne({ discordId, clockOutTime: null });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already clocked in." });
    }

    const officer = await Officer.findOne({ discordId });
    if (!officer) {
      return res.status(404).json({ success: false, message: "Officer not found." });
    }

    const civilian = await Civilian.findById(officer.civilianId);
    const officerName = civilian ? `${civilian.firstName} ${civilian.lastName}` : "Unknown";

    const newSession = await ClockSession.create({
      discordId,
      officerName,
      callsign: officer.callsign,
      department: officer.department,
      clockInTime: new Date(),
    });

    const embed = new EmbedBuilder()
      .setTitle("🕒 Clocked In")
      .setDescription(`You have clocked in as **Officer ${officerName} (${officer.callsign})**`)
      .setColor("Green")
      .setTimestamp();

    // Send DM (non-fatal failure allowed)
    try {
      const user = await client.users.fetch(discordId);
      await user.send({ embeds: [embed] }).catch(() => null);
    } catch (err) {
      console.warn("⚠️ Failed to fetch/send DM:", err.message);
    }

    // Send log embed to platform channel
    const logChannelId = CLOCK_LOG_CHANNELS[officer.department];
    if (logChannelId) {
      try {
        const logChannel = await client.channels.fetch(logChannelId);
        await logChannel.send({ embeds: [embed] });
      } catch (err) {
        console.warn("⚠️ Failed to send to log channel:", err.message);
      }
    }

    res.json({ success: true, session: newSession });
  } catch (err) {
    console.error("❌ Clock-in error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Clock-out
router.post("/out", ensureAuth, async (req, res) => {
  try {
    const discordId = req.user.discordId;

    const session = await ClockSession.findOne({ discordId, clockOutTime: null });
    if (!session) {
      return res.status(400).json({ success: false, message: "You are not clocked in." });
    }

    const officer = await Officer.findOne({ discordId });
    if (!officer) {
      return res.status(404).json({ success: false, message: "Officer not found." });
    }

    const civilian = await Civilian.findById(officer.civilianId);
    const officerName = civilian ? `${civilian.firstName} ${civilian.lastName}` : "Unknown";

    const clockOutTime = new Date();
    const durationMs = clockOutTime - session.clockInTime;
    session.clockOutTime = clockOutTime;
    session.duration = Math.floor(durationMs / 1000);
    await session.save();

    // Calculate total for the week
    const startOfWeek = dayjs().startOf("week").toDate();
    const sessions = await ClockSession.find({
      discordId,
      clockInTime: { $gte: startOfWeek },
      clockOutTime: { $ne: null },
    });
    const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const weeklyTotal = formatDuration(totalSeconds * 1000);

    const embed = new EmbedBuilder()
      .setTitle("⏹️ Clocked Out")
      .setDescription(`You have clocked out as **Officer ${officerName} (${officer.callsign})**`)
      .addFields(
        { name: "Total Time Worked", value: `\`${formatDuration(durationMs)}\`` },
        { name: "This Week's Total", value: `\`${weeklyTotal}\`` }
      )
      .setColor("Red")
      .setTimestamp();

    // Send DM
    try {
      const user = await client.users.fetch(discordId);
      await user.send({ embeds: [embed] }).catch(() => null);
    } catch (err) {
      console.warn("⚠️ Failed to fetch/send DM:", err.message);
    }

    // Send log embed to platform channel
    const logChannelId = CLOCK_LOG_CHANNELS[officer.department];
    if (logChannelId) {
      try {
        const logChannel = await client.channels.fetch(logChannelId);
        await logChannel.send({ embeds: [embed] });
      } catch (err) {
        console.warn("⚠️ Failed to send to log channel:", err.message);
      }
    }

    res.json({ success: true, message: "Clocked out." });
  } catch (err) {
    console.error("❌ Clock-out error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

module.exports = router;
