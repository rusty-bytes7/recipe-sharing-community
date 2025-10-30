import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Recipe } from './Recipe.jsx'
import LikeButton from '../components/likes.jsx'

export function RecipeList({ recipes = [] }) {
  return (
    <div>
      {recipes.map((recipe) => (
        <Fragment key={recipe._id}>
          <Recipe {...recipe} />
          <LikeButton />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape(Recipe.propTypes)).isRequired,
}
