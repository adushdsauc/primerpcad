const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true // Ensure one wallet per user
  },
  balance: {
    type: Number,
    default: 10000,
  }
});

module.exports = mongoose.model("Wallet", WalletSchema);
