const express = require('express');
const Invoice = require('../models/Invoice');
const Contact = require('../models/Contact');
const { verifyToken } = require('../lib/authMiddleware');

const router = express.Router();

// Middleware to verify admin role
router.use(verifyToken);

// Function to validate invoice data
const validateInvoiceData = (data) => {
  const { customer, invoiceNumber, subject, invoiceDate, dueDate, invoicedItems, currency } = data;
  const errors = [];

  if (!customer) errors.push('Customer is required.');
  if (!invoiceNumber || typeof invoiceNumber !== 'string') errors.push('Invoice number is required and must be a string.');
  if (!subject || typeof subject !== 'string') errors.push('Subject is required and must be a string.');
  if (isNaN(new Date(invoiceDate).getTime())) errors.push('Valid invoice date is required.');
  if (isNaN(new Date(dueDate).getTime())) errors.push('Valid due date is required.');
  if (!Array.isArray(invoicedItems) || invoicedItems.length === 0) errors.push('Invoiced items are required and must be an array.');
  if (!currency || !['INR', 'USD'].includes(currency)) errors.push('Currency must be either INR or USD.');

  // Validate each invoiced item
  invoicedItems.forEach((item, index) => {
    if (!item.description || typeof item.description !== 'string') errors.push(`Item ${index + 1} description is required and must be a string.`);
    if (isNaN(item.quantity) || item.quantity < 0) errors.push(`Item ${index + 1} quantity is required and must be a non-negative number.`);
    if (isNaN(item.unitPrice) || item.unitPrice < 0) errors.push(`Item ${index + 1} unit price is required and must be a non-negative number.`);
    if (isNaN(item.tax) || item.tax < 0) errors.push(`Item ${index + 1} tax is required and must be a non-negative number.`);
    if (isNaN(item.discount) || item.discount < 0) errors.push(`Item ${index + 1} discount is required and must be a non-negative number.`);
  });

  return errors;
};

// Create a new invoice
router.post('/', async (req, res) => {
  const errors = validateInvoiceData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const { customer } = req.body;

    const contactExists = await Contact.findById(customer);
    if (!contactExists) return res.status(404).json({ message: 'Contact not found.' });

    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ message: 'Failed to create invoice.' });
  }
});

// Get all invoices with pagination, search, and filtering
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '', status, currency } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  if (isNaN(skip) || isNaN(parseInt(limit))) {
    return res.status(400).json({ message: 'Invalid page or limit.' });
  }

  const query = {
    ...(search && { invoiceNumber: { $regex: search, $options: 'i' } }),
    ...(status && { status }),
    ...(currency && { currency })
  };

  try {
    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('customer');

    res.status(200).json({
      invoices,
      total,
    });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ message: 'Failed to fetch invoices.' });
  }
});

// Get a single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer');

    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ message: 'Failed to fetch invoice.' });
  }
});

// Update an invoice by ID
router.put('/:id', async (req, res) => {
  const errors = validateInvoiceData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const { customer } = req.body;

    const contactExists = await Contact.findById(customer);
    if (!contactExists) return res.status(404).json({ message: 'Contact not found.' });

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('customer');

    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ message: 'Failed to update invoice.' });
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
    res.status(500).json({ message: 'Failed to delete invoice.' });
  }
});

module.exports = router;