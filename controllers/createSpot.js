const Spot = require('../models/spot');
const Location = require('../models/location');
const Image = require('../models/image');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const uuidv4 = require('uuid');

module.exports = async function createSpot(req, res, next) {
  const { name, location, images, description, kickout_level, owner, spotType, contains } = req.body;
  if (req.isAuth) {
    const theOwner = await User.findOne({ _id: owner });

    try {
      const createdLocation = new Location({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      await createdLocation.save();

      const theImages = images.map(async i => {
        const createdImage = new Image({
          // public_url: `${uuid}`,
          base64: i.base64,
        });
        await createdImage.save();
        return createdImage;
      });

      const imageObjects = await Promise.all(
        theImages.map(async image => {
          return await image;
        })
      );

      const imageIDs = imageObjects.map(i => i._id);

      const createdSpot = new Spot({
        name,
        owner,
        kickout_level,
        description,
        location: createdLocation._id,
        images: imageIDs,
        approved: false,
        spotType,
        contains,
      });

      await createdSpot.save();

      owner.spots.push(createdSpot);
      owner.save();

      res.json({
        ...createdSpot._doc,
        _id: createdSpot._id.toString(),
      });
    } catch (e) {
      return new Error(e);
    }
  } else {
    return new Error('Not authenticated');
  }
};
