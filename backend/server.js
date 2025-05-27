require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const fetch = require("node-fetch");

const User = require("./models/User");
const civilianRoutes = require("./routes/civilians");
const licenseRoutes = require("./routes/licenses");
const vehicleRoutes = require("./routes/vehicles");
const authRoutes = require("./routes/auth");
const officerRoutes = require("./routes/officers");
const bankRoutes = require("./routes/bank");
const walletRoutes = require("./routes/wallet");
const weaponRoutes = require("./routes/weapons");
const medicalRecordRoutes = require("./routes/medicalRecords");
const searchRoutes = require("./routes/search");
const penalCodeRoutes = require("./routes/penalCodes");
const reportRoutes = require("./routes/reports");
const dmRoutes = require("./routes/dm");
const callRoutes = require("./routes/calls");
const boloRoutes = require("./routes/bolos");
const clockRoutes = require("./routes/clock");
const { client } = require("./bot");
const psoReportRoutes = require("./routes/psoreports");
const warrantRoutes = require("./routes/warrants");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://primerpcad-pm4h-git-main-princes-projects-8ae55c4f.vercel.app",
  "https://primerpcad-pm4h-ekujzv001-princes-projects-8ae55c4f.vercel.app",
  "https://primerpcad-pm4h-princes-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    name: "sid",
    secret: "super-secret-session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/discord/callback`,
      scope: ["identify", "guilds", "guilds.members.read"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("👤 OAuth profile ID:", profile.id);
        const guildIds = process.env.DISCORD_GUILD_IDS.split(",");
        const botToken = process.env.DISCORD_BOT_TOKEN;
        let allRoles = [];

        for (const guildId of guildIds) {
          const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${profile.id}`, {
            headers: { Authorization: `Bot ${botToken}` },
          });

          console.log(`📡 Guild ${guildId} fetch status:`, res.status);
          if (!res.ok) {
            const errorText = await res.text();
            console.log(`❌ Failed to fetch member from ${guildId}:`, errorText);
            continue;
          }

          const member = await res.json();
          console.log(`✅ Roles from guild ${guildId}:`, member.roles);
          if (Array.isArray(member.roles)) {
            allRoles = [...new Set([...allRoles, ...member.roles])];
          }
        }

        let user = await User.findOne({ discordId: profile.id });
        if (!user) {
          user = await User.create({
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: profile.avatar,
            globalName: profile.global_name,
          });
        }

        const sessionUser = {
          discordId: profile.id,
          username: profile.username,
          discriminator: profile.discriminator,
          avatar: profile.avatar,
          globalName: profile.global_name,
          roles: allRoles,
        };

        return done(null, sessionUser);
      } catch (err) {
        console.error("❌ Discord OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/auth/discord", passport.authenticate("discord"));

app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    console.log("✅ Discord login success");
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

app.get("/auth/failure", (req, res) => res.send("❌ Discord login failed"));

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout failed.");
    res.redirect(`${process.env.FRONTEND_URL}`);
  });
});

app.get("/api/auth/me", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const { discordId, username, discriminator, avatar, globalName, roles } = req.user;
  res.json({ discordId, username, discriminator, avatar, globalName, roles });
});

// Routes
app.use("/api/civilians", civilianRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/weapons", weaponRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/penal-codes", penalCodeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dm", dmRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/bolos", boloRoutes);
app.use((req, res, next) => {
  req.client = client;
  next();
});
app.use("/api/clock", clockRoutes);
app.use("/api/psoreports", psoReportRoutes);
app.use("/api/warrants", warrantRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("📂 Using DB:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

process.on("unhandledRejection", (reason, promise) => {
  console.error("🧨 Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
