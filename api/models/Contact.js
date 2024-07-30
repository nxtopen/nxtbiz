const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['customer', 'lead'],
    required: true,
  },
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
}, { timestamps: true }); // Add timestamps option

// Ensure at least one of email or phone is required
ContactSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    return next(new Error('Either email or phone is required.'));
  }
  next();
});

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);