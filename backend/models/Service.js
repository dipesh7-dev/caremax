const mongoose = require('mongoose');

/**
 * Service Schema
 *
 * This model stores information about the services an organisation offers.  Each
 * service has a type (e.g., 'Daily Living Support'), a main heading for
 * marketing copy, a short subheading, and arrays of strings capturing
 * individual features and benefits.  The arrays make it easy to allow the
 * admin to add as many feature/benefit items as necessary via the UI.
 */
const ServiceSchema = new mongoose.Schema(
  {
    serviceType: { type: String, required: true },
    mainHeading: { type: String, required: true },
    subheading: { type: String, required: true },
    features: [{ type: String }],
    benefits: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);