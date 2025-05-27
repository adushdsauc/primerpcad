const mongoose = require("mongoose");

const weaponSchema = new mongoose.Schema({
  civilianId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Civilian",
  },
  weaponType: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  registeredName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Weapon", weaponSchema);
