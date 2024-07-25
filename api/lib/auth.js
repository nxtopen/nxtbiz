const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return next();
  }

  if (req.path.startsWith('/api')) {
    if (req.path.startsWith('/api/auth')) {
      return next();
    }
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized here' });
    }

    try {
      const decoded = jwt.verify(token, secret);
      console.log(decoded)
      req.user = decoded;
      next();
    } catch (err) {
      console.log(err)
      return res.status(401).json({ message: 'Unauthorized here 2' });
    }
  }
};

module.exports = authMiddleware;