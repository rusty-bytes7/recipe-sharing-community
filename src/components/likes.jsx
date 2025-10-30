//this is frontend code to make a like button component
import { useState } from 'react'

const LikeButton = () => {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    setLikes(likes + 1)
    setLiked(true)
  }

  const handleDislike = () => {
    setLikes(likes - 1)
    setLiked(false)
  }

  return (
    <div>
      <button onClick={liked ? handleDislike : handleLike}>
        {liked ? 'Unlike' : 'Like'} {likes}
      </button>
    </div>
  )
}

export default LikeButton
