const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'canceled'],
    default: 'pending'
  }
});

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);