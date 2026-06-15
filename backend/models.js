const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  cookingTime: { type: Number },
  servings: { type: Number },
  cuisine: { type: String },
  mealType: { type: String },
  dietaryPreference: { type: String },
  image: { type: String },
  video: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
      text: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const MealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  day: { type: String, required: true },
  breakfast: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  lunch: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  dinner: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
});

const User = mongoose.model("User", UserSchema);
const Recipe = mongoose.model("Recipe", RecipeSchema);
const MealPlan = mongoose.model("MealPlan", MealPlanSchema);

module.exports = { User, Recipe, MealPlan };
