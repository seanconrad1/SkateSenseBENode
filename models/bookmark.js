const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    spot: {
        type: Schema.Types.ObjectId,
        ref: 'Spot',
        required: true
    },
}, {
  timestamps: true
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);