import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CreateRecipe() {
  const [token] = useAuth()

  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [cookingTime, setCookingTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [tags, setTags] = useState('')

  const queryClient = useQueryClient()
  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe(token, {
        title,
        ingredients: ingredients.split('\n').filter((i) => i.trim()),
        instructions,
        cookingTime: parseInt(cookingTime) || 0,
        servings: parseInt(servings) || 1,
        difficulty,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t),
      }),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }

  if (!token) return <div>Please log in to create new recipes.</div>

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      <div>
        <label htmlFor='create-title'>Recipe Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </div>

      <div>
        <label htmlFor='create-ingredients'>Ingredients (one per line): </label>
        <textarea
          name='create-ingredients'
          id='create-ingredients'
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows='5'
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder='1 cup flour&#10;2 eggs&#10;1/2 cup milk'
        />
      </div>

      <div>
        <label htmlFor='create-instructions'>Instructions: </label>
        <textarea
          name='create-instructions'
          id='create-instructions'
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows='5'
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div>
          <label htmlFor='create-time'>Cooking Time (minutes): </label>
          <input
            type='number'
            name='create-time'
            id='create-time'
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            min='1'
          />
        </div>

        <div>
          <label htmlFor='create-servings'>Servings: </label>
          <input
            type='number'
            name='create-servings'
            id='create-servings'
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            min='1'
          />
        </div>

        <div>
          <label htmlFor='create-difficulty'>Difficulty: </label>
          <select
            name='create-difficulty'
            id='create-difficulty'
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value='Easy'>Easy</option>
            <option value='Medium'>Medium</option>
            <option value='Hard'>Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor='create-tags'>Tags (comma separated): </label>
        <input
          type='text'
          name='create-tags'
          id='create-tags'
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder='dinner, vegetarian, quick'
        />
      </div>

      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
        disabled={!title || createRecipeMutation.isPending}
      />
      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe created successfully!
        </>
      ) : null}
    </form>
  )
}
