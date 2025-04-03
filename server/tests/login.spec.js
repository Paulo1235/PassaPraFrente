import request from 'supertest'
import { describe, it, expect } from '@jest/globals'
import { app } from '../server.js'

describe('My first test', () => {
  it('should test the server running', async () => {
    const response = await request(app).get('/')
    expect(response.body).toStrictEqual({ ok: true })
  })
})
