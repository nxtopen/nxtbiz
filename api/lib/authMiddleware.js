const jwt = require('jsonwebtoken');
const { parseCookies } = require('nookies');
const User = require('../models/User');

const secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const cookies = parseCookies({ req });
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized here' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ username: decoded.username });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };