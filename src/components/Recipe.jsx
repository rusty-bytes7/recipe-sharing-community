import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({
  title,
  ingredients,
  instructions,
  cookingTime,
  servings,
  difficulty,
  author,
  tags,
}) {
  return (
    <article
      style={{
        border: '1px solid #ccc',
        padding: '16px',
        margin: '16px 0',
        borderRadius: '8px',
      }}
    >
      <h3>{title}</h3>
      <div>
        <strong>Cooking Time:</strong> {cookingTime} minutes
      </div>
      <div>
        <strong>Servings:</strong> {servings}
      </div>
      <div>
        <strong>Difficulty:</strong> {difficulty}
      </div>
      <div>
        <h4>Ingredients:</h4>
        <ul>
          {ingredients?.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Instructions:</h4>
        <p>{instructions}</p>
      </div>
      {tags && tags.length > 0 && (
        <div>
          <strong>Tags:</strong> {tags.join(', ')}
        </div>
      )}
      {author && (
        <em>
          <br />
          Created by <User id={author} />
        </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  instructions: PropTypes.string,
  cookingTime: PropTypes.number,
  servings: PropTypes.number,
  difficulty: PropTypes.string,
  author: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
}
