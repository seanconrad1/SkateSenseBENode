const Bookmark = require('../models/bookmark');
const User = require('../models/user');

module.exports = async function getBookmark(req, res, next) {
  const { user_id, spot_id } = req.body;

  if (user_id && spot_id) {
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

      const value = user.bookmarks.some(bookmark => {
        return bookmark._id.toString() === spot_id.toString();
      });

      console.log('ok what the fuck is value', value);

      res.send({ bookmarked: value });
    } else {
      return new Error('Not authenticated');
    }
  } else {
    const error = new Error('Need both params');
    error.status = 500;
    next(error);
  }
};
