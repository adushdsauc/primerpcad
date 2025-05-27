const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, required: true },
  offense: String,
  fine: Number,
  jailTime: Number,
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  notes: String,
  officerName: String,
  timestamp: Date,
  type: String,
  paid: { type: Boolean, default: false },
}, { _id: false }); // Prevent nested _id inside reports

const CivilianSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  licenseApproved: { type: Boolean, default: false },

  middleInitial: String,
  dateOfBirth: String,
  age: Number,
  sex: String,
  knownAliases: [String],
  residence: String,
  zipCode: String,
  occupation: String,
  height: String,
  weight: String,
  skinTone: String,
  hairColor: String,
  eyeColor: String,

  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  weapons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Weapon" }],

  licenseStatus: {
    type: Map,
    of: {
      approved: Boolean,
      licenseType: String,
      approvedAt: Date,
    },
    default: {},
  },
  licenses: {
    type: [String],
    default: [],
  },

  emergencyContactName: String,
  emergencyContactRelation: String,
  emergencyContactPhone: String,

  // ✅ Final working schema for reports
  reports: {
    type: [ReportSchema],
    default: [],
  },
}, {
  timestamps: true
});

// ✅ Prevent model overwrite issues in dev
module.exports = mongoose.models.Civilian || mongoose.model("Civilian", CivilianSchema);
