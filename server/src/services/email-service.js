import path from 'node:path'
import ejs from 'ejs'
import nodemailer from 'nodemailer'

import { DIRNAME, SMTP_HOST, SMTP_MAIL, SMTP_PASSWORD, SMTP_PORT, SMTP_SERVICE } from '../../config.js'

export class EmailService {
  static async sendEmail (options) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      service: SMTP_SERVICE,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD
      }
    })

    const { email, subject, template, emailData } = options

    const templatePath = path.join(DIRNAME, 'src/mails', template)

    const html = await ejs.renderFile(templatePath, emailData)

    const mailOptions = {
      from: SMTP_MAIL,
      to: email,
      subject,
      html
    }

    console.log(mailOptions)

    await transporter.sendMail(mailOptions)
  }

  static async prepareEmailContent (template, data) {
    return await ejs.renderFile(path.join(DIRNAME, `src/mails/${template}`), data)
  }
}
