const User = require('../models/user');

module.exports = async function updateToAdmin(req, res, next) {
  try {
    await User.updateOne({ email: 'seanconrad123@gmail.com' }, { $set: { admin: true } });

    const user = await User.findOne({ email: 'seanconrad123@gmail.com' });
    res.json(user);
  } catch (e) {
    console.log(e);
  }
};
