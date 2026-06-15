require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const { Recipe } = require("./models");

const recipes = [
  {
    title: "Chicken Biryani",
    description: "Traditional Indian biryani with aromatic spices.",
    ingredients: [
      "Basmati Rice",
      "Chicken",
      "Onion",
      "Tomato",
      "Yogurt",
      "Biryani Masala"
    ],
    steps: [
      "Marinate chicken.",
      "Cook rice until 70% done.",
      "Prepare masala.",
      "Layer rice and chicken.",
      "Cook on low heat and serve."
    ],
    cookingTime: 60,
    servings: 4,
    cuisine: "Indian",
    mealType: "Dinner",
    dietaryPreference: "Non-Vegetarian",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d29a",
    video: "https://www.youtube.com/watch?v=95BCU1n268w"
  },
  {
    title: "Masala Dosa",
    description: "Crispy South Indian dosa filled with potato masala.",
    ingredients: [
      "Dosa Batter",
      "Potatoes",
      "Onions",
      "Mustard Seeds",
      "Curry Leaves"
    ],
    steps: [
      "Prepare potato filling.",
      "Spread dosa batter.",
      "Cook until crisp.",
      "Add masala filling.",
      "Fold and serve."
    ],
    cookingTime: 25,
    servings: 2,
    cuisine: "Indian",
    mealType: "Breakfast",
    dietaryPreference: "Vegetarian",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921",
    video: "https://www.youtube.com/watch?v=CCab5oh0ZOc"
  },
  {
    title: "Veg Pasta",
    description: "Creamy vegetable pasta loaded with fresh vegetables.",
    ingredients: [
      "Pasta",
      "Tomato",
      "Capsicum",
      "Cream",
      "Cheese",
      "Garlic"
    ],
    steps: [
      "Boil pasta.",
      "Cook vegetables.",
      "Prepare cream sauce.",
      "Mix pasta and sauce.",
      "Serve hot."
    ],
    cookingTime: 20,
    servings: 3,
    cuisine: "Italian",
    mealType: "Lunch",
    dietaryPreference: "Vegetarian",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    video: "https://www.youtube.com/watch?v=2N4Jhy3v6G0"
  },
  {
    title: "Chicken Fried Rice",
    description: "Quick and flavorful fried rice with chicken.",
    ingredients: [
      "Rice",
      "Chicken",
      "Egg",
      "Carrot",
      "Onion",
      "Soy Sauce"
    ],
    steps: [
      "Cook rice.",
      "Cook chicken.",
      "Stir-fry vegetables.",
      "Add eggs.",
      "Mix everything with soy sauce."
    ],
    cookingTime: 30,
    servings: 4,
    cuisine: "Chinese",
    mealType: "Dinner",
    dietaryPreference: "Non-Vegetarian",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    video: "https://www.youtube.com/watch?v=qH__o17xHls"
  },
  {
    title: "Chocolate Pancakes",
    description: "Soft and fluffy chocolate pancakes for breakfast.",
    ingredients: [
      "Flour",
      "Milk",
      "Egg",
      "Cocoa Powder",
      "Sugar",
      "Butter"
    ],
    steps: [
      "Prepare batter.",
      "Heat pan.",
      "Pour batter.",
      "Flip pancakes.",
      "Serve with syrup."
    ],
    cookingTime: 15,
    servings: 4,
    cuisine: "American",
    mealType: "Breakfast",
    dietaryPreference: "Vegetarian",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    video: "https://www.youtube.com/watch?v=1APZbL0M9x0"
  }
];

async function seedRecipes() {
  try {
    console.log(
      "MONGODB_URI:",
      process.env.MONGODB_URI ? "Loaded" : "Not Loaded"
    );

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    const count = await Recipe.countDocuments();

    if (count > 0) {
      console.log(`ℹ️ ${count} recipes already exist.`);
    } else {
      await Recipe.insertMany(recipes);
      console.log("✅ 5 recipes added successfully.");
    }

    await mongoose.disconnect();

    console.log("🔌 MongoDB Disconnected");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedRecipes();