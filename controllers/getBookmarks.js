const User = require('../models/user');

module.exports = async function getBookmarks(req, res, next) {
  const { user_id } = req.body;
  if (req.isAuth) {
    const user = await User.findOne({ _id: user_id }).populate([
      {
        path: 'bookmarks',
        model: 'Spot',
        populate: [
          { path: 'images', model: 'Image' },
          { path: 'location', model: 'Location' },
        ],
      },
    ]);

    if (user === null) {
      const error = new Error('Cannot find user');
      error.status = 500;
      next(error);
    } else res.send(user.bookmarks);
  } else {
    return new Error('Not authenticated');
  }
};
