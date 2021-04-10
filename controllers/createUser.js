const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = async function createUser(req, res, next) {
  const { email, name, password, push_token } = req.body;

  if (!validator.isEmail(email)) {
    const error = new Error('E-Mail is invalid');
    error.status = 500;
    next(error);
  }

  if (validator.isEmpty(name)) {
    const error = new Error('Name is invalid.');
    error.status = 500;
    next(error);
  }

  if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
    const error = new Error('Password too short!');
    error.status = 500;
    next(error);
  }

  const existingEmail = await User.findOne({ email: email });

  if (existingEmail !== null) {
    const error = new Error(`${email} exists already!`);
    error.status = 500;
    next(error);
  }

  const existingUser = await User.findOne({ name: name });
  if (existingUser !== null) {
    const error = new Error(`${name} exists already!`);
    error.status = 500;
    next(error);
  }

  const hashedPw = await bcrypt.hash(password, 12);
  let createdUser;
  try {
    createdUser = new User({
      email,
      name,
      password: hashedPw,
      admin: false,
      push_token,
    });

    await createdUser.save();
  } catch (errorCreateingUser) {
    const error = new Error('Cannot create the user');
    error.status = 500;
    next(error);
  }

  const token = jwt.sign(
    {
      email: createdUser.email,
      name: createdUser.name,
      user_id: createdUser._id.toString(),
      admin: createdUser.admin,
      push_token: createdUser.push_token,
    },
    process.env.SECRET_KEY,
    { expiresIn: '60d' }
  );

  res.json({
    token,
  });
};
