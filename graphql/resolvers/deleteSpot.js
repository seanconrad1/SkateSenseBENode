const Spot = require('../../models/spot');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = async function deleteSpot({ _id }, req, res) {
  if (req.request.isAuth) {
    let spot = '';

    try {
      spot = await Spot.findById(_id);
    } catch (e) {
      throw new Error('Unable to find spot');
    }

    const owner = await User.findOne({ _id: decoded.user_id });

    if (spot.owner.toString() === decoded.user_id) {
      await Spot.findByIdAndDelete(_id, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log('Deleted : ', docs);
        }
      });

      owner.spots = owner.spots.filter(i => i !== _id);
      owner.save();
    }

    return 'Spot was deleted';
  } else {
    return new Error('Not authenticated');
  }
};
