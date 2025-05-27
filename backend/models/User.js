const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: String,
  discriminator: String,
  avatar: String,
  globalName: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
