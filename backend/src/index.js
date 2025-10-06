import dotenv from 'dotenv'
dotenv.config()

import { app } from './app.js'
import { initDatabase } from './db/init.js'

const PORT = process.env.PORT || 8080
const DATABASE_URL = process.env.DATABASE_URL

console.log('Starting server...')
console.log('PORT:', PORT)
console.log('DATABASE_URL:', DATABASE_URL ? 'Set' : 'Not set')

try {
  console.log('Connecting to database...')
  await initDatabase()
  console.log('Database connected successfully')

  app.listen(PORT, '0.0.0.0', () => {
    console.info(`express server running on http://0.0.0.0:${PORT}`)
    console.log('Server startup complete')
  })
} catch (err) {
  console.error('error connecting to database:', err)
  process.exit(1)
}
