const User = require('../../models/User');
const jwt = require('jsonwebtoken');

module.exports = async function deleteUser({ _id }, req, res) {
  if (req.isAuth) {
    try {
      const user = await User.findById(_id);
    } catch (e) {
      throw new Error('Could not find user');
    }

    await User.findByIdAndDelete({
      _id,
    });

    return 'User was deleted';
  } else {
    return new Error('Not authenticated');
  }
};
