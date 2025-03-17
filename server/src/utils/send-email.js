import path from 'node:path'
import nodemailer from 'nodemailer'
import ejs from 'ejs'

import { DIRNAME, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_SERVICE, SMTP_MAIL } from '../../config.js'

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD
    }
  })

  const { email, subject, template, data } = options

  const templatePath = path.join(DIRNAME, 'src/mails', template)

  const html = await ejs.renderFile(templatePath, data)

  const mailOptions = {
    from: SMTP_MAIL,
    to: email,
    subject,
    html
  }

  await transporter.sendMail(mailOptions)
}
