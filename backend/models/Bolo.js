const mongoose = require("mongoose");

const BoloSchema = new mongoose.Schema({
  boloType: { type: String, enum: ["vehicle", "person"], required: true },
  vehicleDescription: String,
  vehiclePlate: String,
  personDescription: String,
  personName: String,
  location: String,
  details: String,
}, { timestamps: true });

module.exports = mongoose.model("Bolo", BoloSchema);
