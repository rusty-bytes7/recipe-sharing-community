import mongoose, { Schema } from 'mongoose'

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    ingredients: [String],
    instructions: String,
    cookingTime: Number, // in minutes
    servings: Number,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    tags: [String],
  },
  { timestamps: true },
)

export const Recipe = mongoose.model('recipe', recipeSchema)
