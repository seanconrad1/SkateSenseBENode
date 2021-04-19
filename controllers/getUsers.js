const User = require('../models/user');
const Spots = require('../models/spot');
const Bookmarks = require('../models/bookmark');
const Image = require('../models/image');
const Location = require('../models/location');

module.exports = async function getUsers(req, res, next) {
  // if (req.isAuth) {
  const userList = await User.find({})
    .populate({
      path: 'spots',
      model: Spots,
      populate: [
        { path: 'images', model: Image },
        { path: 'location', model: Location },
      ],
    })
    .populate({
      path: 'bookmark',
      model: Bookmarks,
    });

  if (userList === null) {
    const errorGetUsers = new Error('Cannot find users');
    errorGetUsers.code = 404;
    throw errorGetUsers;
  }

  res.json(userList);
  // } else {
  //   return new Error('Not authenticated');
  // }
};
