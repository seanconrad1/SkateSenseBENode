const User = require('../models/user');

module.exports = async function getSpotOwner(req, res, next) {
  const { user_id } = req.body;

  if (req.isAuth) {
    let user;

    try {
      user = await User.findOne({ _id: user_id });
    } catch (e) {
      console.log(e);
    }

    if (user === null) {
      const userError = new Error('Cannot find user');
      userError.code = 404;

      return userError;
    }

    res.json(user);
  } else {
    return new Error('Not authenticated');
  }
};
