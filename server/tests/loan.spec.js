import request from 'supertest'
import { vi, expect, test } from 'vitest'
import app from '../server.js'
import LoanRepository from '../src/repositories/loan-repository.js'
import ProposalLoanRepository from '../src/repositories/proposal-loan-repository.js'

vi.mock('../src/repositories/loan-repository.js')
vi.mock('../src/repositories/proposal-loan-repository.js')

test('Deve criar um emprestimo com sucesso', async () => {
  LoanRepository.getLoanById.mockResolvedValueOnce({ id: 4 })

  ProposalLoanRepository.createProposalLoan.mockResolvedValueOnce({
    newValue: 100,
    userId: 7,
    loanId: 6
  })

  const response = await request(app)
    .post('/proposal-loans/create/1')
    .send({ newValue: 100 })

  expect(response.status).toBe(201)
})
