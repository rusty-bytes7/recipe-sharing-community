import dotenv from 'dotenv'
dotenv.config()

import { app } from './app.js'
import { initDatabase } from './db/init.js'

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.info(`express server running on http://localhost:${PORT}`)
})

initDatabase()
  .then(() => {
    console.info('Database connected successfully')
  })
  .catch((err) => {
    console.error('Error connecting to database:', err)
  })
