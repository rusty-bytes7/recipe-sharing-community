import mongoose from 'mongoose'
import { beforeAll, afterAll, beforeEach } from '@jest/globals'

import { initDatabase } from '../db/init.js'

beforeAll(async () => {
  await initDatabase()
})

beforeEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.disconnect()
})
