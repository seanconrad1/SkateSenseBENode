const User = require('../models/user');

module.exports = async function getUsers(req, res, next) {
  if (req.isAuth) {
    const userList = await User.find({}).populate([
      {
        path: 'bookmarks',
        path: 'spots',
        populate: [
          { path: 'images', model: 'Image' },
          { path: 'location', model: 'Location' },
        ],
      },
    ]);

    if (userList === null) {
      const errorGetUsers = new Error('Cannot find users');
      errorGetUsers.code = 404;
      throw errorGetUsers;
    }

    res.json(userList);
  } else {
    return new Error('Not authenticated');
  }
};
