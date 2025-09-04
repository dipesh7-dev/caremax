const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    orgName: String,
    address: String,
    phone: String,
    email: String,
    permissions: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', SettingSchema);