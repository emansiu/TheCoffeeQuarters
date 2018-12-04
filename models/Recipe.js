const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const RecipeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },

  recipename: {
    type: String,
    required: true
  },
  brewmethod: {
    type: String,
    required: true
  },
  preferreddevice: {
    type: String
  },
  ingredients: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  beanname: {
    type: String
  },
  roasters: {
    type: String
  },
  origin: {
    type: String
  },
  varietal: {
    type: String
  },
  roast: {
    type: String,
    required: true
  },
  altitude: {
    type: String
  },
  process: {
    type: String
  },
  producer: {
    type: String
  },
  flavornotes: {
    type: String
  },
  dateadded: {
    type: Date
  },
  favorited: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Recipe = mongoose.model("recipe", RecipeSchema);
