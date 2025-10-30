export const getRecipes = async (queryParams) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
  const res = await fetch(
    `${baseUrl}/recipes?` + new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const createRecipe = async (token, recipe) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
  const res = await fetch(`${baseUrl}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  })
  return await res.json()
}
