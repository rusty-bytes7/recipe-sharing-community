export const getLikeCount = async (recipeId) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
  const url = `${baseUrl}/recipes/${recipeId}/likes`
  console.log('Fetching like count from:', url)

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch like count')
  }
  const likes = await res.json()
  return likes.length
}

export const checkIfUserLikedRecipe = async (token, recipeId) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
  const url = `${baseUrl}/recipes/${recipeId}/likes/check`
  console.log('Checking like status from:', url)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to check like status')
  }
  const data = await res.json()
  return data.isLiked
}

export const likeRecipe = async (token, recipeId) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
  const url = `${baseUrl}/recipes/${recipeId}/likes`
  console.log('Liking recipe at:', url)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    const errorText = await res.text()
    console.error('Like failed:', res.status, errorText)
    throw new Error('Failed to like recipe')
  }
  return await res.json()
}

export const unlikeRecipe = async (token, recipeId) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
  const url = `${baseUrl}/recipes/${recipeId}/likes`
  console.log('Unliking recipe at:', url)

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    const errorText = await res.text()
    console.error('Unlike failed:', res.status, errorText)
    throw new Error('Failed to unlike recipe')
  }
}
