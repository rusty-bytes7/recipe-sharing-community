//this is frontend code to make a like button component
import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { AuthContext } from '../contexts/AuthContext.jsx'
import {
  getLikeCount,
  checkIfUserLikedRecipe,
  likeRecipe,
  unlikeRecipe,
} from '../api/likes.js'

const LikeButton = ({ recipeId }) => {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const { token } = useContext(AuthContext)

  //fetch initial like count and user's like status
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const likeCount = await getLikeCount(recipeId)
        setLikes(likeCount)

        if (token) {
          const isLiked = await checkIfUserLikedRecipe(token, recipeId)
          setLiked(isLiked)
        }
      } catch (error) {
        console.error('Error fetching like data:', error)
      }
    }

    if (recipeId) {
      fetchLikeData()
    }
  }, [recipeId, token])

  const handleLike = async () => {
    console.log('Like button clicked, token:', !!token, 'recipeId:', recipeId)

    if (!token) {
      alert('Please log in to like recipes')
      return
    }

    setLoading(true)
    try {
      if (liked) {
        console.log('Attempting to unlike recipe')
        await unlikeRecipe(token, recipeId)
        setLikes((prev) => prev - 1)
        setLiked(false)
        console.log('Successfully unliked recipe')
      } else {
        console.log('Attempting to like recipe')
        await likeRecipe(token, recipeId)
        setLikes((prev) => prev + 1)
        setLiked(true)
        console.log('Successfully liked recipe')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleLike}
        disabled={loading}
        style={{
          backgroundColor: liked ? '#ff5454ff' : '#a5dfdbff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading
          ? 'Loading...'
          : `${liked ? '❤️ Unlike' : '🤍 Like'} (${likes})`}
      </button>
    </div>
  )
}

LikeButton.propTypes = {
  recipeId: PropTypes.string.isRequired,
}

export default LikeButton
