const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = async function deleteBookmark(req, res, next) {
  const { user_id, spot_id } = req.body;

  if (req.isAuth) {
    let userToUpdate;

    try {
      userToUpdate = await User.findOne({ _id: user_id });
    } catch (e) {
      return new Error("User doesn't exist");
    }

    const index = userToUpdate.bookmarks.indexOf(spot_id);

    let newArray = [];
    if (index !== -1) {
      userToUpdate.bookmarks.splice(index, 1);
      newArray = userToUpdate.bookmarks;
    }

    userToUpdate.save();
    res.json(userToUpdate.bookmarks);
  } else {
    return new Error('Not authenticated');
  }
};
