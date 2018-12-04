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
  recipe: [
    {
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
      }
    }
  ],
  //   -------------- EDUCATION SECTION ----------
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  //   -------------- SOCIAL SECTION ----------
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
