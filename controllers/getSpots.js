const Spot = require('../models/spot');
const jwt = require('jsonwebtoken');

module.exports = async function getSpots(req, res, nex) {
  if (req.isAuth) {
    const spotList = await Spot.find({ approved: true }).populate([
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
        path: 'users',
        model: 'User',
        populate: { path: 'user', model: 'User' },
      },
    ]);

    if (spotList === null) {
      throw new Error('Cannot find spots');
    }

    res.json({
      spotList,
    });
  } else {
    return new Error('Not authenticated');
  }
};
