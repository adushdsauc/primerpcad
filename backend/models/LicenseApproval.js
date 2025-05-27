const mongoose = require("mongoose");

const LicenseApprovalSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  licenseType: { type: String, required: true },
  approvedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LicenseApproval", LicenseApprovalSchema);
