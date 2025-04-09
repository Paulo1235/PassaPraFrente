import { afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  process.env.NODE_ENV = 'testing'
})

afterAll(() => {
  delete process.env.NODE_ENV
})
