import { Recipe } from '../db/models/recipe.js'
import { User } from '../db/models/user.js'

export async function createRecipe(
  userId,
  {
    title,
    image,
    ingredients,
    instructions,
    cookingTime,
    servings,
    difficulty,
    tags,
  },
) {
  const recipe = new Recipe({
    title,
    image,
    author: userId,
    ingredients,
    instructions,
    cookingTime,
    servings,
    difficulty,
    tags,
  })
  return await recipe.save()
}

async function listRecipes(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const mongoSortOrder = sortOrder === 'ascending' ? 1 : -1

  //if sorting by likes, use aggregation
  if (sortBy === 'likes') {
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'recipe',
          as: 'likes',
        },
      },
      {
        $addFields: {
          likeCount: { $size: '$likes' },
        },
      },
      {
        $sort: { likeCount: mongoSortOrder },
      },
      {
        $project: {
          likes: 0, //Remove the likes array from output
        },
      },
    ]
    return await Recipe.aggregate(pipeline)
  }

  //regular sorting for other fields
  return await Recipe.find(query).sort({ [sortBy]: mongoSortOrder })
}

export async function listAllRecipes(options) {
  return await listRecipes({}, options)
}

export async function listRecipesByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listRecipes({ author: user._id }, options)
}

export async function listRecipesByTag(tags, options) {
  return await listRecipes({ tags }, options)
}

export async function getRecipeById(recipeId) {
  return await Recipe.findById(recipeId)
}

export async function updateRecipe(
  userId,
  recipeId,
  {
    title,
    image,
    ingredients,
    instructions,
    cookingTime,
    servings,
    difficulty,
    tags,
  },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    {
      $set: {
        title,
        image,
        ingredients,
        instructions,
        cookingTime,
        servings,
        difficulty,
        tags,
      },
    },
    { new: true },
  )
}

export async function deleteRecipe(userId, recipeId) {
  return await Recipe.deleteOne({ _id: recipeId, author: userId })
}

export async function likeRecipe(recipeId) {
  return await Recipe.findByIdAndUpdate(
    recipeId,
    { $inc: { likes: 1 } },
    { new: true },
  )
}

export async function dislikeRecipe(recipeId) {
  return await Recipe.findByIdAndUpdate(
    recipeId,
    { $inc: { likes: -1 } },
    { new: true },
  )
}
