const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const dbConnect = require('../lib/mongoose');
const User = require('../models/User');
const cookie = require('cookie');

const router = express.Router();

const secret = process.env.JWT_SECRET;

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

router.get('/', (req, res) => {
  res.status(405).json({ message: 'Method not allowed' });
});

router.post('/', async (req, res) => {
  await dbConnect();

  const { username, password } = req.body;

  // Validate input
  const { error } = loginSchema.validate({ username, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ username });

  if (user && await user.comparePassword(password)) {
    const token = jwt.sign({ username: user.username, role: user.role }, secret, { expiresIn: '1h' });

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/'
    }));

    return res.status(200).json({
      message: 'Login successful',
      username: user.username,
      role: user.role,
      token,
      profile: user.profile // Return user profile details
    });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;