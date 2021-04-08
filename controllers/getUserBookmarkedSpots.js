const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = async function getUserBookmarkedSpots({ user_id }, req, res) {
  if (req.isAuth) {
    const userBookmarkedSpotList = await User.find({ _id: user_id }).populate([
      {
        path: 'bookmarks',
        model: 'Spot',
        populate: [
          { path: 'images', model: 'Image' },
          { path: 'location', model: 'Location' },
        ],
      },
    ]);

    if (userBookmarkedSpotList === null) {
      throw new Error('You have no bookmarked spots');
    }

    return userBookmarkedSpotList;
  } else {
    return new Error('Not authenticated');
  }
};
