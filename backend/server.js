// Load environment variables
require("dotenv").config();

// Import dependencies
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const fetch = require("node-fetch");
const path = require("path");

// Import models and routes
const User = require("./models/User");
// ... (other route imports)

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://primerpcad-pm4h-git-main-princes-projects-8ae55c4f.vercel.app",
  "https://primerpcad-pm4h-ekujzv001-princes-projects-8ae55c4f.vercel.app",
  "https://primerpcad-pm4h-princes-projects.vercel.app"
];

// Configure CORS
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

// Configure session management
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "super-secret-session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js with Discord strategy
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
        // ... (your existing Discord strategy logic)
      } catch (err) {
        console.error("❌ Discord OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Authentication routes
app.get("/auth/discord", passport.authenticate("discord"));
app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/auth/failure" }),
  (req, res) => {
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

// API routes
app.use("/api/civilians", civilianRoutes);
// ... (other API routes)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// The "catchall" handler: for any request that doesn't match above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
