const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../data/penalCodes.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const codes = JSON.parse(data);
    res.json(codes);
  } catch (err) {
    console.error("❌ Failed to load penal codes file:", err.message);
    res.status(500).json({ error: "Failed to load penal codes" });
  }
});

module.exports = router;
