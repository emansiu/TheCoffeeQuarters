const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users" //<mongoose way of referencing users db from profile
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  bio: {
    type: String
  },
  //   -------------- RECIPE SECTION ----------
  myrecipes: [
    {
      myrecipe: {
        type: Schema.Types.ObjectId,
        ref: "recipes" //<mongoose way of referencing recipes db from profile
      }
    }
  ],
  //   -------------- FAVORITE SECTION ----------
  favorites: [
    {
      favorite: {
        type: Schema.Types.ObjectId,
        ref: "recipes" //<mongoose way of referencing recipes db from profile
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
