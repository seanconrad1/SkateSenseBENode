const Spot = require('../models/spot');
const Bookmark = require('../models/bookmark');

const jwt = require('jsonwebtoken');

module.exports = async function getNotApprovedList(req, res, next) {
  console.log('got here');
  if (req.isAuth) {
    const spotList = await Spot.find({ approved: false }).populate([
      {
        path: 'images',
        model: 'Image',
      },
      {
        path: 'location',
        model: 'Location',
      },
      {
        path: 'bookmarks',
        model: 'Bookmark',
        populate: { path: 'user', model: 'User' },
      },
      {
        path: 'owner',
        model: 'User',
        populate: { path: 'user', model: 'User' },
      },
    ]);

    if (spotList === null) {
      throw new Error('Cannot find spots');
    }

    res.json(spotList);
  } else {
    return new Error('Not authenticated');
  }
};
