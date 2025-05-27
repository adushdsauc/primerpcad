// models/StoreItem.js
const mongoose = require("mongoose");

const StoreItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  roleRequirement: { type: String }, // Discord role ID if required
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StoreItem", StoreItemSchema);
