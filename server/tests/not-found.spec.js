import request from 'supertest'
import { expect, test } from 'vitest'
import app from '../server.js'

test('Should respond with 404 on *', async () => {
  const response = await request(app).get('/undefined-route')
  expect(response.statusCode).toBe(404)
})
