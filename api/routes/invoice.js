const express = require('express');
const Invoice = require('../models/Invoice');
const Contact = require('../models/Contact'); // Updated to handle both customers and leads
const { verifyToken } = require('../lib/authMiddleware');

const router = express.Router();

// Middleware to verify admin role
router.use(verifyToken);

// Function to validate invoice data
const validateInvoiceData = (data) => {
  const { customer, invoiceNumber, date, amount, status } = data;
  const errors = [];

  if (!customer) errors.push('Customer is required.');
  if (!invoiceNumber || typeof invoiceNumber !== 'string') errors.push('Invoice number is required and must be a string.');
  if (isNaN(new Date(date))) errors.push('Valid date is required.');
  if (isNaN(amount)) errors.push('Amount is required and must be a number.');
  if (!['pending', 'paid', 'canceled'].includes(status)) errors.push('Status must be either pending, paid, or canceled.');

  return errors;
};

// Create a new invoice
router.post('/', async (req, res) => {
  const errors = validateInvoiceData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const contactExists = await Contact.findById(req.body.customer);
    if (!contactExists) return res.status(404).json({ message: 'Contact not found.' });

    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(400).json({ message: 'Failed to create invoice.' });
  }
});

// Get all invoices with pagination and search
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '', status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  if (isNaN(skip) || isNaN(parseInt(limit))) {
    return res.status(400).json({ message: 'Invalid page or limit.' });
  }

  const query = {
    ...(search && { invoiceNumber: { $regex: search, $options: 'i' } }),
    ...(status && { status }),
  };

  try {
    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('customer'); // Ensure the customer field is populated

    res.status(200).json({
      invoices,
      total,
    });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(400).json({ message: 'Failed to fetch invoices.' });
  }
});

// Get a single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customer'); // Ensure the customer field is populated
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(400).json({ message: 'Failed to fetch invoice.' });
  }
});

// Update an invoice by ID
router.put('/:id', async (req, res) => {
  const errors = validateInvoiceData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const contactExists = await Contact.findById(req.body.customer);
    if (!contactExists) return res.status(404).json({ message: 'Contact not found.' });

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('customer');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(400).json({ message: 'Failed to update invoice.' });
  }
});

// Delete an invoice by ID
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(400).json({ message: 'Failed to delete invoice.' });
  }
});

module.exports = router;