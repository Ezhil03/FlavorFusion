# 🍳 FlavorFusion — Recipe Sharing Platform

A full-stack MERN recipe sharing platform with AI-style search, meal planning, and community features.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Axios + React Router DOM
- **Backend:** Node.js + Express.js + JWT + bcryptjs
- **Database:** MongoDB + Mongoose

---

## ⚡ Quick Setup

### 1. Install & Start Backend
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:5000
```

### 2. Install & Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. MongoDB
**Option A — Local MongoDB:**
Install from https://mongodb.com/try/download/community and start the service.
The default `.env` already points to `mongodb://localhost:27017/flavorfusion`.

**Option B — MongoDB Atlas (Cloud):**
Get your connection string from https://cloud.mongodb.com and update `backend/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flavorfusion
```

---

## 📁 Project Structure
```
FlavorFusion/
├── backend/
│   ├── server.js        # Express server entry
│   ├── models.js        # Mongoose models (User, Recipe, MealPlan)
│   ├── middleware.js    # JWT auth middleware
│   ├── routes.js        # All API routes
│   ├── .env             # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx       # Router + Navbar
    │   ├── api.js        # Axios instance with JWT injection
    │   └── pages/
    │       ├── Home.jsx         # Recipe discovery + search + filters
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Recipe.jsx       # Full detail, rate, comment, like
    │       ├── AddRecipe.jsx    # Create new recipe
    │       ├── Profile.jsx      # Edit profile + my recipes
    │       ├── Favorites.jsx    # Saved recipes
    │       └── MealPlanner.jsx  # Weekly plans + shopping list
    └── package.json
```

---

## 🔑 Features
- ✅ Register / Login with JWT
- ✅ Create, view, edit, delete recipes
- ✅ Search by name or ingredients
- ✅ Filter by cuisine, meal type, dietary preference
- ✅ Like / Unlike recipes
- ✅ Rate recipes (1–5 stars)
- ✅ Comment on recipes
- ✅ Save favorites
- ✅ Follow / Unfollow users
- ✅ User profile with bio + avatar
- ✅ Weekly meal planner
- ✅ Auto-generated shopping list
- ✅ YouTube video embedding
- ✅ Responsive mobile-first design

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | ✗ | Register user |
| POST | /api/login | ✗ | Login |
| GET | /api/profile | ✓ | Get own profile |
| PUT | /api/profile | ✓ | Update profile |
| GET | /api/recipes | ✗ | List/filter recipes |
| POST | /api/recipes | ✓ | Create recipe |
| GET | /api/recipes/:id | ✗ | Recipe detail |
| PUT | /api/recipes/:id | ✓ | Update recipe |
| DELETE | /api/recipes/:id | ✓ | Delete recipe |
| POST | /api/recipes/:id/like | ✓ | Toggle like |
| POST | /api/recipes/:id/rate | ✓ | Rate recipe |
| POST | /api/recipes/:id/comment | ✓ | Add comment |
| GET | /api/favorites | ✓ | Get favorites |
| POST | /api/favorites/:id | ✓ | Add to favorites |
| DELETE | /api/favorites/:id | ✓ | Remove favorite |
| POST | /api/follow/:id | ✓ | Follow/unfollow |
| GET | /api/search?ingredient=... | ✗ | Ingredient search |
| GET | /api/mealplans | ✓ | Get meal plans |
| POST | /api/mealplans | ✓ | Create meal plan |
| DELETE | /api/mealplans/:id | ✓ | Delete meal plan |
