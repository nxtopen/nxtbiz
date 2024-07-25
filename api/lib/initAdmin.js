const dbConnect = require('./mongoose');
const User = require('../models/User');
const chalk = require('chalk');

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generatePassword = () => {
  const numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
  const elements = ['admin', ...numbers.map(num => num.toString())];
  const shuffled = shuffleArray(elements);
  return shuffled.join('');
};

const initAdmin = async () => {
  await dbConnect();

  const userCount = await User.countDocuments({});
  if (userCount === 0) {
    const password = 'admin';

    const adminUser = new User({
      username: 'admin',
      password,
      role: 'ADMIN',
      promptChangePassword: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
      },
    });

    await adminUser.save();
    console.log(chalk.green('Default admin user created successfully.'));
    console.log(chalk.blue(`Username: ${chalk.bold('admin')}`));
    console.log(chalk.blue(`Password: ${chalk.bold(password)}`));
    console.log(chalk.yellow('Make sure to change the password after login.'));
  } else {
    console.log(chalk.cyan('Database already contains users.'));
  }
};

module.exports = initAdmin;