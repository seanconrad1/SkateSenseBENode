const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'spot',
      },
    ],
    admin: {
      type: Boolean,
      required: true,
    },
    push_token: {
      type: String,
      required: true,
    },
    spots: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Spot',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
