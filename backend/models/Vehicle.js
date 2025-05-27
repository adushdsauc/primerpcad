// models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  civilianId: { type: mongoose.Schema.Types.ObjectId, ref: "Civilian", required: true },
  plate: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  insured: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ["Sedan", "Coupe", "SUV", "Truck", "Offroad", "Motorcycle"],
    required: true
  },
  impounded: { type: Boolean, default: false } // ✅ Added for impound tracking
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
