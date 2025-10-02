# Recipe Sharing Community

A full-stack web application for sharing and discovering recipes built with React, Node.js, Express, and MongoDB.

## Features

- Create and share recipes with ingredients, instructions, cooking time, and difficulty level
- Browse recipes by author or tags
- Sort recipes by creation date
- User authentication and authorization
- Responsive design

## Tech Stack

**Frontend:**

- React + Vite
- React Router for navigation
- TanStack Query for data fetching
- JWT authentication

**Backend:**

- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or Docker)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   cd backend && npm install
   ```

3. Set up environment variables:

   - Create `.env` in root directory with:
     ```
     VITE_BACKEND_URL=http://localhost:3001/api/v1
     ```
   - Create `backend/.env` with:
     ```
     PORT=3001
     DATABASE_URL=mongodb://localhost:27017/recipes
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     ```

4. Start the development servers:

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

## Using Docker

Alternatively, you can use Docker Compose to run the entire application:

```bash
docker-compose up
```

This will start:

- MongoDB database on port 27017
- Backend API on port 3001
- Frontend application on port 3000

## API Endpoints

- `GET /api/v1/recipes` - Get all recipes (with optional filtering)
- `POST /api/v1/recipes` - Create a new recipe (requires authentication)
- `GET /api/v1/recipes/:id` - Get a specific recipe
- `PATCH /api/v1/recipes/:id` - Update a recipe (requires authentication)
- `DELETE /api/v1/recipes/:id` - Delete a recipe (requires authentication)
- `POST /api/v1/user/signup` - Register a new user
- `POST /api/v1/user/login` - Login user

## Recipe Schema

```javascript
{
  title: String (required),
  author: ObjectId (required),
  ingredients: [String],
  instructions: String,
  cookingTime: Number, // in minutes
  servings: Number,
  difficulty: String, // 'Easy', 'Medium', 'Hard'
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```
