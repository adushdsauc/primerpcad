const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// ✅ List of Discord Guild IDs (servers)
const guilds = [
  "1372312806107512894", // Xbox
  "1369495333574545559"  // PlayStation
];

// ✅ Auth middleware
const ensureAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

// ✅ Main /me route
router.get("/me", ensureAuth, async (req, res) => {
  const { discordId, username, discriminator, avatar } = req.user;
  const rolesSet = new Set();

  for (const guildId of guilds) {
    try {
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`, {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
      });

      if (!response.ok) continue;

      const data = await response.json();

      // ✅ Add each raw role ID directly
      data.roles.forEach(roleId => {
        rolesSet.add(roleId);
      });

    } catch (err) {
      console.error(`❌ Failed to fetch roles for guild ${guildId}:`, err.message);
    }
  }

  return res.json({
    discordId,
    username,
    discriminator,
    avatar,
    roles: [...rolesSet] // ✅ Raw role IDs sent to frontend
  });
});

module.exports = router;
