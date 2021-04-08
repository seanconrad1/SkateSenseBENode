const User = require('../models/user');

module.exports = async function getAdmins(req, res, next) {
  if (req.isAuth) {
    const admins = await User.find({ admin: true });

    if (admins === null) {
      return new Error('No admins');
    }

    res.json(admins);
  } else {
    return new Error('Not authenticated');
  }
};
