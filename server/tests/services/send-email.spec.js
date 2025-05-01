import { describe, it, expect, vi, beforeEach } from 'vitest'
import EmailService from '../../src/services/email-service.js'
import nodemailer from 'nodemailer'
import ejs from 'ejs'

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn()
  }
}))

vi.mock('ejs', () => ({
  default: {
    renderFile: vi.fn()
  }
}))

describe('EmailService', () => {
  const sendMail = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    nodemailer.createTransport.mockReturnValue({ sendMail })
  })

  it('envia email com template renderizado', async () => {
    ejs.renderFile.mockResolvedValue('<h1>Email test</h1>')

    await EmailService.sendEmail({
      email: 'teste@email.com',
      subject: 'Assunto',
      template: 'template.ejs',
      emailData: { nome: 'João' }
    })

    expect(ejs.renderFile).toHaveBeenCalled()
    expect(sendMail).toHaveBeenCalled()
  })
})
