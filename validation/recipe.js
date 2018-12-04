const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRecipeInput(data) {
  let errors = {};

  data.recipename = !isEmpty(data.recipename) ? data.recipename : "";
  data.brewmethod = !isEmpty(data.brewmethod) ? data.brewmethod : "";
  data.ingredients = !isEmpty(data.ingredients) ? data.ingredients : "";
  data.instructions = !isEmpty(data.instructions) ? data.instructions : "";
  data.roast = !isEmpty(data.roast) ? data.roast : "";

  if (Validator.isEmpty(data.recipename)) {
    errors.recipename = "Recipe name is required";
  }
  if (Validator.isEmpty(data.brewmethod)) {
    errors.brewmethod = "Brew method is required";
  }
  if (Validator.isEmpty(data.ingredients)) {
    errors.ingredients = "Ingredient list is required";
  }
  if (Validator.isEmpty(data.instructions)) {
    errors.instructions = "Instructions are required";
  }
  if (Validator.isEmpty(data.roast)) {
    errors.roast = "Type of roast is required (ie. light, medium, dark)";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
