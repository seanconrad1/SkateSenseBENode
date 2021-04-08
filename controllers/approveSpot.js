const Spot = require('../models/spot');

module.exports = async function approveSpotMutation(req, res, next) {
  const { _id } = req.body;

  if (req.isAuth) {
    let spot = '';

    try {
      spot = await Spot.findById(_id);
    } catch (e) {
      throw new Error('Unable to find spot');
    }

    spot.approved = true;
    spot.save();

    res.json('Spot was approved!');
  } else {
    return new Error('Not authenticated');
  }
};
