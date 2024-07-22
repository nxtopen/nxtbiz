const dbConnect = require('./mongoose');
const User = require('../models/User');

const initAdmin = async () => {
  await dbConnect();

  const userCount = await User.countDocuments({});
  if (userCount === 0) {
    const adminUser = new User({
      username: 'admin',
      password: 'admin',
      role: 'ADMIN',
      promtChangePassword: true
    });

    await adminUser.save();
    console.log(`Default admin user created.
        Use admin as username and admin as password for the user. Make sure to change after login`);
  } else {
    console.log('Database connection check completed');
  }
};

module.exports = initAdmin;