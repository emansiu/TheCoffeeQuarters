const express = require("express");
const router = express.Router();
const passport = require("passport");

// load validation
const validateProfileInput = require("../../validation/profile");
const validateFavoriteInput = require("../../validation/favorite");
const validateRecipeInput = require("../../validation/recipe");

// load Profile & User
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Recipe = require("../../models/Recipe");

// GET api/profile/test
// DESCRIPTION: tests profile route
// Access Public----------------------------------------------------
router.get("/test", (req, res) => res.json({ msg: "Profile working" }));

// GET api/profile/
// DESCRIPTION: get current users profile
// Access Private---------------------------------------------------
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar", "recipes"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// GET api/profile/all
// DESCRIPTION: Get all profiles
// Access Public-------------------------------------------------------

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "there are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "there are no profiles" }));
});

// GET api/profile/handle/:handle
// DESCRIPTION: Get profile by handle
// Access Public-------------------------------------------------------

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// GET api/profile/user/:user_id
// DESCRIPTION: Get profile by user ID
// Access Public----------------------------------------------------------

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "there is no profile for this user" })
    );
});

// POST api/profile/
// DESCRIPTION: create or edit user profile
// Access Private---------------------------------------------------------------
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    //   Get fields
    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.bio) profileFields.bio = req.body.bio;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // then we are updating
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // creating profile

        // check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// POST api/profile/recipe
// DESCRIPTION: Add recipes to profile
// Access Private---------------------------------------------------------------
router.post(
  "/recipe",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRecipeInput(req.body);

    // check validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newRec = {
        recipename: req.body.recipename,
        brewmethod: req.body.brewmethod,
        preferreddevice: req.body.preferreddevice,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        beanname: req.body.beanname,
        roasters: req.body.roasters,
        origin: req.body.origin,
        varietal: req.body.varietal,
        roast: req.body.roast,
        altitude: req.body.altitude,
        process: req.body.process,
        producer: req.body.producer,
        flavornotes: req.body.flavornotes,
        dateadded: req.body.dateadded
      };
      // add to rec array
      profile.recipe.unshift(newRec);

      Profile.save().then(profile => res.json(profile));
    });
  }
);

// POST api/profile/education
// DESCRIPTION: Add education to profile
// Access Private---------------------------------------------------------------
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateFavoriteInput(req.body);

    // check validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      // add to exp array
      profile.education.unshift(newEducation);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// DELETE api/profile/experience/:exp_id
// DESCRIPTION: Delete experience from profile
// Access Private---------------------------------------------------------------
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // splice out of array
        profile.experience.splice(removeIndex, 1);

        // save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// DELETE api/profile/education/:edu_id
// DESCRIPTION: Delete experience from profile
// Access Private---------------------------------------------------------------
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // splice out of array
        profile.education.splice(removeIndex, 1);

        // save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// DELETE api/profile/myprofile
// DESCRIPTION: Delete profile
// Access Private---------------------------------------------------------------
router.delete(
  "/myprofile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => res.status(404).json(err));
  }
);

// DELETE api/profile
// DESCRIPTION: Delete user
// Access Private---------------------------------------------------------------
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndRemove({ _id: req.user.id })
      .then(() => res.json({ success: true }))
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
