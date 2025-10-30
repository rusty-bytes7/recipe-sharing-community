import { Like } from '../db/models/like.js'
import { Recipe } from '../db/models/recipe.js'

export async function createLike(userId, recipeId) {
  const like = new Like({ user: userId, recipe: recipeId })
  await like.save()

  //Increment the like count on the recipe
  await Recipe.findByIdAndUpdate(recipeId, { $inc: { likes: 1 } })

  return like
}

export async function deleteLike(userId, recipeId) {
  const result = await Like.deleteOne({ user: userId, recipe: recipeId })

  //Decrement the like count on the recipe if a like was deleted
  if (result.deletedCount > 0) {
    await Recipe.findByIdAndUpdate(recipeId, { $inc: { likes: -1 } })
  }

  return result
}

export async function getLikesByRecipe(recipeId) {
  return await Like.find({ recipe: recipeId }).populate('user', 'username')
}

export async function getLikesByUser(userId) {
  return await Like.find({ user: userId }).populate('recipe')
}

export async function checkIfUserLikedRecipe(userId, recipeId) {
  const like = await Like.findOne({ user: userId, recipe: recipeId })
  return !!like
}
