import { StatusCodes } from 'http-status-codes'
import cloudinary from 'cloudinary'

import { handleError, HttpException } from '../utils/error-handler.js'
import { hashPassword } from '../utils/password.js'
import response from '../utils/response.js'
import UserRepository from '../repositories/user-repository.js'
import PasswordService from '../services/password-service.js'
import EmailService from '../services/email-service.js'
import SaleRepository from '../repositories/sale-repository.js'
import LoanRepository from '../repositories/loan-repository.js'
import GiveawayRepository from '../repositories/giveaway-repository.js'
import TransactionSaleRepository from '../repositories/transaction-sale-repository.js'
import TransactionLoanRepository from '../repositories/transaction-loan-repository.js'
import WinnerGiveawayRepository from '../repositories/winner-giveaway-repository.js'

class UserController {
  static async getUserById (req, res) {
    const { id } = req.params

    try {
      const user = await UserRepository.getUserById(id)

      if (!user) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, user)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o utilizador.')
    }
  }

  static async getAllUsers (req, res) {
    try {
      const users = await UserRepository.getAllUsers()

      return response(res, true, StatusCodes.OK, users)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os utilizadores.')
    }
  }

  static async updateUser (req, res) {
    const data = req.body
    const id = req.user.Utilizador_ID

    try {
      const existingUser = await UserRepository.getUserById(id)

      const updatedData = {
        name: data.name || existingUser.Nome,
        contact: data.contact || existingUser.Contacto
        //! meter morada?
      }

      await UserRepository.updateUser(updatedData, id)

      return response(res, true, StatusCodes.OK, 'Utilizador atualizado som sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o utilizador.')
    }
  }

  static async getUserByEmail (req, res) {
    const { email } = req.params

    try {
      const user = await UserRepository.getUserByEmail(email)

      if (!user) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, user)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o utilizador.')
    }
  }

  static async getUserInfo (req, res) {
    const id = req.user.Utilizador_ID

    try {
      let user = await UserRepository.getUserWithAvatar(id)

      if (!user.PublicID || !user.Url) {
        user = await UserRepository.getUserById(id)
      }

      return response(res, true, StatusCodes.OK, user)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o utilizador.')
    }
  }

  static async updateUserPassword (req, res) {
    const id = req.user.Utilizador_ID
    const { newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
      return response(res, false, StatusCodes.BAD_REQUEST, 'As palavra-passe são diferentes!')
    }

    try {
      const hashedPassword = await hashPassword(newPassword)

      await UserRepository.updateUserPassword(id, hashedPassword)

      return response(res, true, StatusCodes.OK, 'Palavra-passe atualizada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a palavra-passe.')
    }
  }

  static async sendNewPasswordEmail (req, res) {
    const { email } = req.body

    try {
      const user = await UserRepository.existsUserByEmail(email)

      if (!user) {
        throw new HttpException('Email inválido.', StatusCodes.NOT_FOUND)
      }

      const newPassword = await PasswordService.generateAndStoreNewPassword(user.Utilizador_ID)

      const emailData = { user, newPassword }

      await EmailService.sendEmail({
        email: user.Email,
        subject: 'Nova palavra-passe',
        template: 'new-password.ejs',
        emailData
      })

      return response(res, true, StatusCodes.OK, 'Verifique o seu email para verificar a sua nova palavra-passe.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao enviar o email para a sua conta.')
    }
  }

  static async saveUserAvatar (req, res) {
    const id = req.user.Utilizador_ID
    const { thumbnail } = req.body

    try {
      const userAvatar = await UserRepository.getUserAvatar(id)

      if (userAvatar?.PublicID) {
        await cloudinary.v2.uploader.destroy(userAvatar.PublicID)
      }

      const uploadedImage = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'users',
        width: 150
      })

      const success = userAvatar?.PublicID
        ? await UserRepository.updateUserAvatar(id, uploadedImage.public_id, uploadedImage.secure_url)
        : await UserRepository.uploadUserAvatar(id, uploadedImage.public_id, uploadedImage.secure_url)

      if (!success) {
        return response(res, false, StatusCodes.BAD_REQUEST, 'Erro ao salvar imagem de perfil.')
      }
      return response(res, true, StatusCodes.OK, userAvatar?.PublicID ? 'Imagem de perfil atualizada.' : 'Imagem de perfil inserida.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a imagem de perfil.')
    }
  }

  static async getReviewRateUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const sales = await SaleRepository.getUserSales(userId)

      const loans = await LoanRepository.getUserLoans(userId)

      const giveaways = await GiveawayRepository.getUserGiveaways(userId)

      let totalReviews = 0
      let totalItems = 0

      for (const sale of sales) {
        const transactionSale = await TransactionSaleRepository.getTransactionBySaleId(sale.Venda_ID)

        if (transactionSale && transactionSale.Nota > 0) {
          totalReviews += transactionSale.Nota
          totalItems += 1
        }
      }

      for (const loan of loans) {
        const transactionLoan = await TransactionLoanRepository.getTransactionByLoanId(loan.Emprestimo_ID)

        if (transactionLoan && transactionLoan.Nota > 0) {
          totalReviews += transactionLoan.Nota
          totalItems += 1
        }
      }

      for (const giveaway of giveaways) {
        const winnerGiveaway = await WinnerGiveawayRepository.getWinnerGiveawayById(giveaway.Sorteio_ID)

        if (winnerGiveaway && winnerGiveaway.Nota > 0) {
          totalReviews += winnerGiveaway.Nota
          totalItems += 1
        }
      }

      const reviewRate = totalItems > 0 ? Math.round(totalReviews / totalItems) : 0

      return response(res, true, StatusCodes.OK, reviewRate)
    } catch (error) {
      handleError(res, error, 'Não foi possível obter a avaliação do utilizador.')
    }
  }
}

export default UserController
