const User = require('../models/user');
const Spot = require('../models/spot');

module.exports = async function createBookmark(req, res, next) {
  const { spot_id, user_id } = req.body;

  if (req.isAuth) {
    try {
      // find spot
      const spot = await Spot.findOne({ _id: spot_id });
      // if no spot found and no error is thrown return your own
      if (!spot) {
        const error = new Error('No spot found.');
        error.status = 500;
        next(error);
      }

      // get user
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
      if (!user) {
        const error = new Error('Cannot find user');
        error.status = 500;
        next(error);
      }

      if (user.bookmarks.some(i => i._id.toString() === spot_id)) {
        const error = new Error('Spot already bookmarked');
        error.status = 500;
        next(error);
      } else {
        user.bookmarks.push(spot_id);
        user.save();
      }

      res.json({
        bookmarks: user.bookmarks,
      });
    } catch (e) {
      throw new Error(e);
    }
  } else {
    return new Error('Not authenticated');
  }
};
