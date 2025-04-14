import request from 'supertest'
import { vi, expect, test } from 'vitest'
import app from '../app.js'
import SaleRepository from '../src/repositories/sale-repository.js'

vi.mock('../src/repositories/sale-repository.js')
vi.mock('../src/repositories/proposal-sale-repository.js')

// test('Deve criar uma proposta de venda com sucesso', async () => {
//   SaleRepository.getSaleById.mockResolvedValueOnce({ id: 4 })

//   ProposalSaleRepository.createProposalSale.mockResolvedValueOnce({
//     newValue: 100,
//     userId: 7,
//     saleId: 6
//   })

//   const response = await request(app)
//     .post('/proposal-sales/create/4')
//     .send({ newValue: 100, userId: 7, saleId: 6 })

//   expect(response.status).toBe(201)
// })

test('Deve retornar erro 404 quando a venda não for encontrada', async () => {
  SaleRepository.getSaleById.mockResolvedValueOnce(null)

  const response = await request(app)
    .post('/proposal-sales/create/999')
    .send({ newValue: 100 })

  expect(response.status).toBe(404)
})
