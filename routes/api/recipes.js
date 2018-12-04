const express = require("express");
const router = express.Router();
const passport = require("passport");

// Recipe & Profile model
const Recipe = require("../../models/Recipe");
const Profile = require("../../models/Profile");
// validation
const validateRecipeInput = require("../../validation/recipe");

// @route GET api/recipes/test
// @desc tests post route
// @access Public-----------------------------------------------------------
router.get("/test", (req, res) => res.json({ msg: "Recipe working" }));

// @route GET api/recipes
// @desc get recipes
// @access Public----------------------------------------------------------
router.get("/", (req, res) => {
  Recipe.find()
    .sort({ date: -1 })
    .then(posts => res.json(recipes))
    .catch(err => res.status(404).json({ nopostfound: "no recipes found" }));
});

// @route GET api/recipes/:id
// @desc get post by id
// @access Public----------------------------------------------------------
router.get("/:id", (req, res) => {
  Recipe.findById(req.params.id)
    .then(post => res.json(recipe))
    .catch(err =>
      res.status(404).json({ nopostfound: "no recipe found with that ID" })
    );
});

// @route POST api/recipes
// @desc Create recipe
// @access Private----------------------------------------------------------
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRecipeInput(req.body);

    // check validation
    if (!isValid) {
      // if any errors, send 400 w errors object
      return res.status(400).json(errors);
    }
    const newPost = new Recipe({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route DELETE api/posts/:id
// @desc DELETE post
// @access Private----------------------------------------------------------
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Recipe.findById(req.params.id)
        .then(post => {
          // check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          post
            .remove()
            .then(() => res.json({ success: "post successfully deleted" }));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "no post found to delete" })
        );
    });
  }
);

// @route POST api/posts/like/:id
// @desc Like post
// @access Private----------------------------------------------------------
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Recipe.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

// @route POST api/posts/unlike/:id
// @desc Unlike post
// @access Private----------------------------------------------------------
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Recipe.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "you have not yet liked this post" });
          }

          // get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // splice out of array
          post.likes.splice(removeIndex, 1);

          // save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

// @route POST api/posts/comment/:id
// @desc Add comment to post
// @access Private----------------------------------------------------------
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      // if any errors, send 400 w errors object
      return res.status(400).json(errors);
    }
    Recipe.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //   add to comments array
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "no post found" }));
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc remove comment from post
// @access Private----------------------------------------------------------
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Recipe.findById(req.params.id)
      .then(post => {
        // check if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ nocommentexists: "comment does not exist" });
        }

        //  get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "no post found" }));
  }
);

module.exports = router;
