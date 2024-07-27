const express = require('express');
const Customer = require('../models/Customer');
const { verifyToken } = require('../lib/authMiddleware');

const router = express.Router();

// Middleware to verify admin role
router.use(verifyToken);

// Function to validate customer data
const validateCustomerData = (data) => {
  const { firstName, lastName, email, phone, address } = data;
  const errors = [];

  if (!firstName || typeof firstName !== 'string') errors.push('First name is required and must be a string.');
  if (!lastName || typeof lastName !== 'string') errors.push('Last name is required and must be a string.');
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required.');
  if (!phone || typeof phone !== 'string') errors.push('Phone is required and must be a string.');
  if (!address || typeof address !== 'string') errors.push('Address is required and must be a string.');

  return errors;
};

// Create a new customer
router.post('/', async (req, res) => {
  const errors = validateCustomerData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(400).json({ message: 'Failed to create customer.' });
  }
});

// Get all customers with pagination and search
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  if (isNaN(skip) || isNaN(parseInt(limit))) {
    return res.status(400).json({ message: 'Invalid page or limit.' });
  }

  const query = search ? {
    $or: [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ]
  } : {};

  try {
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      customers,
      total
    });
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(400).json({ message: 'Failed to fetch customers.' });
  }
});

// Get a single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });
    res.status(200).json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(400).json({ message: 'Failed to fetch customer.' });
  }
});

// Update a customer by ID
router.put('/:id', async (req, res) => {
  const errors = validateCustomerData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });
    res.status(200).json(customer);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(400).json({ message: 'Failed to update customer.' });
  }
});

// Delete a customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(400).json({ message: 'Failed to delete customer.' });
  }
});

module.exports = router;