const Spot = require('../models/spot');
const jwt = require('jsonwebtoken');
const distance = require('../utils/distanceCalc');

module.exports = async function getUserCreatedSpots(req, res, next) {
  const { latitude, longitude } = req.body;

  if (req.isAuth) {
    const token = req.headers.authorization.split('Bearer ')[1];

    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    let userCreatedSpotsList;
    try {
      userCreatedSpotsList = await Spot.find({ owner: decoded.user_id }).populate([
        {
          path: 'images',
          model: 'Image',
        },
        {
          path: 'location',
          model: 'Location',
        },
      ]);
    } catch (e) {
      throw new Error('no user created spots');
    }

    if (userCreatedSpotsList.length > 0) {
      let createdSpots = userCreatedSpotsList.map(i => {
        console.log(distance(i.location.latitude, i.location.longitude, latitude, longitude));

        i.distance = distance(i.location.latitude, i.location.longitude, latitude, longitude);

        i.party = true;
        return i;
      });

      createdSpots.sort((a, b) => {
        return a.distance - b.distance;
      });

      if (createdSpots === null) {
        throw new Error('You have no created spots');
      }

      res.json(createdSpots);
    } else {
      res.json([]);
    }
  } else {
    return new Error('Not authenticated');
  }
};
