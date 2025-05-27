const express = require("express");
const router = express.Router();
const MedicalRecord = require("../models/MedicalRecord");

router.post("/", async (req, res) => {
  const { civilianId, description } = req.body;
  if (!civilianId || !description)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const record = await MedicalRecord.create({
      civilianId,
      description,
    });

    res.json({ success: true, record });
  } catch (err) {
    console.error("Medical record error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
