const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    UserId: {
      type: String,
      ref: 'user',
      required: true,
    }


  },
  { timestamps: true }
);

module.exports = mongoose.model('post', blogSchema);