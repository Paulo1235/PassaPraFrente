import request from 'supertest'
import app from '../../app.js'

import { describe, it, expect } from 'vitest'

describe('POST /api/users', () => {
  it('retorna erro se as senhas forem diferentes', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Maria',
        email: 'maria@example.com',
        password: '123456',
        confirmPassword: '654321',
        birthDate: '1995-10-10',
        contact: '912345678'
      })

    expect(res.status).toBe(400)
  })

  // it('criar um utilizador com sucesso', async () => {
  //   const userData = {
  //     name: 'João Silva',
  //     birthDate: '2005-05-23T03:00:00Z',
  //     contact: '+351923456789',
  //     email: 'joao.silva@example.com',
  //     password: 'senha123',
  //     confirmPassword: 'senha123'
  //   }

  //   await request(app)
  //     .post('/api/auth/register')
  //     .send(userData)
  //     .expect(201)
  // })

  it('retorna erro se o utilizador já existir', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Hugo Pereira',
        email: 'dhugo045@gmail.com',
        password: '123456',
        confirmPassword: '123456',
        birthDate: '2005-05-23T03:00:00Z',
        contact: '+351912345678'
      })

    expect(res.status).toBe(409)
  })
})
