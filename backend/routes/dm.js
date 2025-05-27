const express = require("express");
const router = express.Router();
const { Client, GatewayIntentBits } = require("discord.js");

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

(async () => {
  try {
    await bot.login(process.env.DISCORD_BOT_TOKEN);
    console.log("✅ Discord bot logged in");
  } catch (err) {
    console.error("❌ Failed to log in Discord bot:", err);
  }
})();

router.post("/send", async (req, res) => {
  const { discordId, embed, components } = req.body;

  if (!discordId || !embed) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const user = await bot.users.fetch(discordId);
    if (!user) return res.status(404).json({ error: "User not found." });

    await user.send({
      embeds: [embed],
      components: components || [],
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("DM send error:", err);
    return res.status(500).json({ error: "Failed to send DM." });
  }
});

module.exports = router;
