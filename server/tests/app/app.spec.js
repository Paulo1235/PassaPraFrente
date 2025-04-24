import request from 'supertest'
import app from '../../app.js'
import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('responder com um status de 200 no endpoint root', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})
