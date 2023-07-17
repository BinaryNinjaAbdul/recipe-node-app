const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: " field is required.",
  },
  description: {
    type: String,
    required: " field is required.",
  },
  email: {
    type: String,
    required: " field is required.",
  },
  ingredients: {
    type: Array,
    required: " field is required.",
  },
  category: {
    type: String,
    enum: ["Thai", "American", "Chinese", "Mexican", "Pakistani"],
    required: " field is required.",
  },
  image: {
    type: String,
    required: " field is required.",
  },
});

recipeSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model("Recipe", recipeSchema);
