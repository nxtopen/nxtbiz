const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'canceled'],
    default: 'pending'
  },
  invoicedItems: {
    type: [InvoiceItemSchema],
    required: true
  },
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the `updatedAt` field before each save
InvoiceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);