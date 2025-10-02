import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { userRoutes } from './routes/users.js'

import { recipesRoutes } from './routes/recipes.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())

recipesRoutes(app)
userRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Recipe Sharing API!')
})

export { app }
