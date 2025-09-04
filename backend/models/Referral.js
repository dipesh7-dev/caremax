const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: Date,
    gender: String,
    phone: String,
    email: String,
    address: String,
    documents: [
      {
        name: String,
        url: String
      }
    ],
    status: { type: String, enum: ['new', 'review', 'approved'], default: 'new' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Referral', ReferralSchema);