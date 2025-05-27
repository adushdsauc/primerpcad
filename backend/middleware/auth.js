// backend/middleware/auth.js
module.exports.ensureAuth = (req, res, next) => {
  const isValid =
    typeof req.isAuthenticated === "function" && req.isAuthenticated() && req.user?.discordId;

  if (isValid) {
    return next();
  }

  console.warn("❌ Unauthorized request blocked. Session or discordId missing:", req.user);
  return res.status(401).json({ success: false, message: "Unauthorized" });
};
