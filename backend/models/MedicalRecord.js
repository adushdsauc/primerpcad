const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  civilianId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Civilian",
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
