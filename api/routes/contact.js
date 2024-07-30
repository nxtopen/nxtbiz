const express = require('express');
const Contact = require('../models/Contact');
const { verifyToken } = require('../lib/authMiddleware');

const router = express.Router();

// Middleware to verify admin role
router.use(verifyToken);

// Function to validate contact data
const validateContactData = (data) => {
  const { firstName, lastName, email, phone, address, type } = data;
  const errors = [];

  if (!firstName || typeof firstName !== 'string') errors.push('First name is required and must be a string.');
  if (lastName && typeof lastName !== 'string') errors.push('Last name must be a string.');
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required.');
  if (phone && typeof phone !== 'string') errors.push('Phone must be a string.');
  if (address && typeof address !== 'string') errors.push('Address must be a string.');
  if (type && !['customer', 'lead'].includes(type)) errors.push('Type must be either customer or lead.');

  return errors;
};

// Create a new contact
router.post('/', async (req, res) => {
  const errors = validateContactData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    console.error('Error creating contact:', err);
    res.status(400).json({ message: 'Failed to create contact.' });
  }
});

// Get all contacts with pagination, sorting, searching, and filtering
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'firstName', order = 'asc', search = '', filter = 'all' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  if (isNaN(skip) || isNaN(parseInt(limit))) {
    return res.status(400).json({ message: 'Invalid page or limit.' });
  }

  // Create a query object based on search and filter parameters
  const query = {
    ...(search && {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    }),
    ...(filter !== 'all' && { type: filter }),
  };

  try {
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      contacts,
      total,
    });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(400).json({ message: 'Failed to fetch contacts.' });
  }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found.' });
    res.status(200).json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(400).json({ message: 'Failed to fetch contact.' });
  }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
  const errors = validateContactData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ message: 'Contact not found.' });
    res.status(200).json(contact);
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(400).json({ message: 'Failed to update contact.' });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found.' });
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(400).json({ message: 'Failed to delete contact.' });
  }
});

module.exports = router;