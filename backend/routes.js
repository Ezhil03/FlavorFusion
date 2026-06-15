const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Recipe, MealPlan } = require("./models");
const { auth } = require("./middleware");

const router = express.Router();

// ─── AUTH ────────────────────────────────────────────────────────────────────

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "User registered successfully", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── USER ────────────────────────────────────────────────────────────────────

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("favorites");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/profile", auth, async (req, res) => {
  try {
    const { name, profilePic, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { name, profilePic, bio }, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── RECIPES ─────────────────────────────────────────────────────────────────

router.post("/recipes", auth, async (req, res) => {
  try {
    const recipe = await Recipe.create({ ...req.body, createdBy: req.userId });
    res.json({ message: "Recipe created", recipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/recipes", async (req, res) => {
  try {
    const { search, cuisine, dietaryPreference, mealType } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (cuisine) filter.cuisine = cuisine;
    if (dietaryPreference) filter.dietaryPreference = dietaryPreference;
    if (mealType) filter.mealType = mealType;
    const recipes = await Recipe.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/recipes/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (recipe.createdBy.toString() !== req.userId) return res.status(403).json({ error: "Unauthorized" });
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/recipes/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (recipe.createdBy.toString() !== req.userId) return res.status(403).json({ error: "Unauthorized" });
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── RATINGS ─────────────────────────────────────────────────────────────────

router.post("/recipes/:id/rate", auth, async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be between 1 and 5" });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    const existing = recipe.ratings.find((r) => r.user.toString() === req.userId);
    if (existing) {
      existing.rating = rating;
    } else {
      recipe.ratings.push({ user: req.userId, rating });
    }
    await recipe.save();
    const avg = recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length;
    res.json({ message: "Rating added", avgRating: avg.toFixed(1), ratings: recipe.ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── COMMENTS ────────────────────────────────────────────────────────────────

router.post("/recipes/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.userId);
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    recipe.comments.push({ user: req.userId, name: user.name, text, createdAt: new Date() });
    await recipe.save();
    res.json({ message: "Comment added", comments: recipe.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LIKES ───────────────────────────────────────────────────────────────────

router.post("/recipes/:id/like", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    const liked = recipe.likes.includes(req.userId);
    if (liked) {
      recipe.likes = recipe.likes.filter((id) => id.toString() !== req.userId);
    } else {
      recipe.likes.push(req.userId);
    }
    await recipe.save();
    res.json({ message: "Like toggled", likes: recipe.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── FAVORITES ───────────────────────────────────────────────────────────────

router.post("/favorites/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.favorites.includes(req.params.id)) {
      user.favorites.push(req.params.id);
      await user.save();
    }
    res.json({ message: "Recipe added to favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/favorites/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $pull: { favorites: req.params.id } });
    res.json({ message: "Recipe removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── FOLLOW ──────────────────────────────────────────────────────────────────

router.post("/follow/:id", auth, async (req, res) => {
  try {
    if (req.params.id === req.userId) return res.status(400).json({ error: "Cannot follow yourself" });
    const target = await User.findById(req.params.id);
    const me = await User.findById(req.userId);
    if (!target) return res.status(404).json({ error: "User not found" });
    const isFollowing = me.following.includes(req.params.id);
    if (isFollowing) {
      me.following = me.following.filter((id) => id.toString() !== req.params.id);
      target.followers = target.followers.filter((id) => id.toString() !== req.userId);
    } else {
      me.following.push(req.params.id);
      target.followers.push(req.userId);
    }
    await me.save();
    await target.save();
    res.json({ message: isFollowing ? "Unfollowed" : "Followed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SEARCH ──────────────────────────────────────────────────────────────────

router.get("/search", async (req, res) => {
  try {
    const { ingredient } = req.query;
    if (!ingredient) return res.json([]);
    const terms = ingredient.split(" ").filter(Boolean);
    const regexes = terms.map((t) => new RegExp(t, "i"));
    const recipes = await Recipe.find({ ingredients: { $all: regexes } }).populate("createdBy", "name");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── MEAL PLANS ──────────────────────────────────────────────────────────────

router.post("/mealplans", auth, async (req, res) => {
  try {
    const { day, breakfast, lunch, dinner } = req.body;
    const plan = await MealPlan.create({ user: req.userId, day, breakfast: breakfast || null, lunch: lunch || null, dinner: dinner || null });
    res.json({ message: "Meal plan created", mealPlan: plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/mealplans", auth, async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.userId })
      .populate("breakfast", "title ingredients")
      .populate("lunch", "title ingredients")
      .populate("dinner", "title ingredients");
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/mealplans/:id", auth, async (req, res) => {
  try {
    await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Meal plan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
