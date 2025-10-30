import {
  createLike,
  deleteLike,
  getLikesByRecipe,
  getLikesByUser,
  checkIfUserLikedRecipe,
} from '../services/likes.js'
import { requireAuth } from '../middleware/jwt.js'

export function likesRoutes(app) {
  //Like a recipe
  app.post('/api/v1/recipes/:recipeId/likes', requireAuth, async (req, res) => {
    try {
      const like = await createLike(req.auth.sub, req.params.recipeId)
      return res.status(201).json(like)
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: 'Recipe already liked' })
      }
      console.error('error creating like', err)
      return res.status(500).end()
    }
  })

  //Unlike a recipe
  app.delete(
    '/api/v1/recipes/:recipeId/likes',
    requireAuth,
    async (req, res) => {
      try {
        const { deletedCount } = await deleteLike(
          req.auth.sub,
          req.params.recipeId,
        )
        if (deletedCount === 0) return res.status(404).end()
        return res.status(204).end()
      } catch (err) {
        console.error('error deleting like', err)
        return res.status(500).end()
      }
    },
  )

  //Get all likes for a recipe
  app.get('/api/v1/recipes/:recipeId/likes', async (req, res) => {
    try {
      const likes = await getLikesByRecipe(req.params.recipeId)
      return res.json(likes)
    } catch (err) {
      console.error('error getting likes', err)
      return res.status(500).end()
    }
  })

  //Get all likes by a user
  app.get('/api/v1/users/:userId/likes', async (req, res) => {
    try {
      const likes = await getLikesByUser(req.params.userId)
      return res.json(likes)
    } catch (err) {
      console.error('error getting user likes', err)
      return res.status(500).end()
    }
  })

  //Check if user liked a recipe
  app.get(
    '/api/v1/recipes/:recipeId/likes/check',
    requireAuth,
    async (req, res) => {
      try {
        const isLiked = await checkIfUserLikedRecipe(
          req.auth.sub,
          req.params.recipeId,
        )
        return res.json({ isLiked })
      } catch (err) {
        console.error('error checking like status', err)
        return res.status(500).end()
      }
    },
  )
}
