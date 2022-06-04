const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { default: mongoose } = require('mongoose');

const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  campsites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campsite',
    },
    { timestamps: true },
  ],
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
