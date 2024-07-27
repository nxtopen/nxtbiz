const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: '', // Allow empty strings
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows only one unique value, but not required
  },
  phone: {
    type: String,
    sparse: true, // Allows only one unique value, but not required
  },
  address: {
    type: String,
    default: '', // Allow empty strings
  },
});

// Ensure at least one of email or phone is required
CustomerSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    return next(new Error('Either email or phone is required.'));
  }
  next();
});

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);