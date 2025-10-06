import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null
let sampleRecipes = []

beforeAll(async () => {
  // Define sample recipes template (user will be assigned in beforeEach)
  sampleRecipes = [
    {
      title: 'Classic Chocolate Chip Cookies',
      ingredients: ['flour', 'butter', 'sugar', 'chocolate chips'],
      instructions: 'Mix ingredients and bake for 12 minutes',
      cookingTime: 15,
      servings: 24,
      difficulty: 'Easy',
      tags: ['dessert', 'cookies'],
    },
    {
      title: 'Spaghetti Carbonara',
      ingredients: ['spaghetti', 'eggs', 'parmesan', 'pancetta'],
      instructions: 'Cook pasta, mix with eggs and cheese',
      cookingTime: 20,
      servings: 4,
      difficulty: 'Medium',
      tags: ['pasta', 'italian'],
    },
    {
      title: 'Beef Wellington',
      ingredients: [
        'beef tenderloin',
        'puff pastry',
        'mushrooms',
        'prosciutto',
      ],
      instructions: 'Sear beef, wrap in pastry, bake until golden',
      cookingTime: 90,
      servings: 6,
      difficulty: 'Hard',
      tags: ['beef', 'pastry', 'gourmet'],
    },
  ]
})

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'Homemade Pizza',
      ingredients: ['flour', 'tomato sauce', 'mozzarella', 'basil'],
      instructions: 'Mix dough, add toppings, bake at 450°F for 12 minutes.',
      cookingTime: 25,
      servings: 4,
      difficulty: 'Medium',
      tags: ['pizza', 'italian'],
    }

    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
    // we need to explicitly convert the id to a string, because it is an ObjectId object
    expect(String(foundRecipe.author?._id)).toMatch(String(testUser?._id))
  })

  test('without title should fail', async () => {
    const recipe = {
      ingredients: ['flour', 'sugar'],
      instructions: 'Recipe with no title',
      tags: ['dessert'],
    }
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Simple Recipe',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

let createdSampleRecipes = []

beforeEach(async () => {
  // Recreate the test user since all collections are cleared
  testUser = await createUser({ username: 'dan', password: 'hunter2' })

  createdSampleRecipes = []
  for (const recipe of sampleRecipes) {
    const recipeWithUser = { ...recipe, author: testUser._id }
    const createdRecipe = new Recipe(recipeWithUser)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})

describe('listing recipes', () => {
  test('should return all recipes', async () => {
    const recipes = await listAllRecipes()
    expect(recipes.length).toEqual(createdSampleRecipes.length)
  })

  test('should return recipes sorted by creation date descending by default', async () => {
    const recipes = await listAllRecipes()
    const sortedSampleRecipes = createdSampleRecipes.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(recipes.map((recipe) => recipe.createdAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const recipes = await listAllRecipes({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSampleRecipes = createdSampleRecipes.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(recipes.map((recipe) => recipe.updatedAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.updatedAt),
    )
  })

  test('should be able to filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor(testUser.username)
    expect(recipes.length).toBe(3)
  })

  test('should be able to filter recipes by tag', async () => {
    const recipes = await listRecipesByTag('gourmet')
    expect(recipes.length).toBe(1)
  })
})

describe('getting a recipe', () => {
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})

describe('updating recipes', () => {
  test('should update the specified property', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      instructions: 'Updated cooking instructions',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.instructions).toEqual('Updated cooking instructions')
  })

  test('should not update other properties', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      instructions: 'Updated cooking instructions',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Classic Chocolate Chip Cookies')
  })

  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      instructions: 'Updated cooking instructions',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe(
      testUser._id,
      '000000000000000000000000',
      {
        instructions: 'Updated cooking instructions',
      },
    )
    expect(recipe).toEqual(null)
  })
})

describe('deleting recipes', () => {
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
