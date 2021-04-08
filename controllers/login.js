const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');

module.exports = async function login(req, res, next) {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return new Error('Invalid email format');
  }
  if (validator.isEmpty(password)) {
    return new Error('Password is empty');
  }

  let user;
  try {
    user = await User.findOne({ email });
  } catch (errorFindUser) {
    const error = new Error('There is no user registred with this email. Sign in or try again with another email');
    error.status = 500;
    next(error);
  }

  // compare password
  if (!(await bcrypt.compare(password, user.password))) {
    const error = new Error('Passwords do not match');
    error.status = 500;
    next(error);
  }

  try {
    const token = jwt.sign(
      {
        user_id: user._id.toString(),
        email: user.email,
        admin: user.admin,
        name: user.name,
      },
      process.env.SECRET_KEY,
      { expiresIn: '60d' }
    );

    res.json({
      token,
    });
  } catch (errorCreateToken) {
    return new Error('Cannot create a token');
  }
};
