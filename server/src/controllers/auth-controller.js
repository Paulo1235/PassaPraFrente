import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

import { handleError, HttpException } from '../utils/error-handler.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import { sendToken, createActivationToken } from '../utils/jwt.js'
import response from '../utils/response.js'
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../../config.js'
import UserRepository from '../repositories/user-repository.js'
import EmailService from '../services/email-service.js'

/**
 * Este Controller atua como intermediário entre os pedidos do utilizador e os repositórios.
 * Além disso, lida com as respostas, retornando status e mensagens adequadas de acordo com o sucesso ou falha de cada operação.
 */
class AuthController {
  /**
   * Regista um novo utilizador.
   * @param {Object} req - O objeto de pedido que contém os dados do utilizador.
   * @param {Object} res - O objeto de resposta utilizado para enviar a resposta.
   */
  static async createUser (req, res) {
    const { name, birthDate, contact, email, password, confirmPassword } = req.body

    // Valida se as palavras-passe coincidem
    if (password !== confirmPassword) {
      return response(res, false, StatusCodes.BAD_REQUEST, 'As palavras-passe são diferentes!')
    }

    try {
      // Verifica se o utilizador já existe na base de dados pelo email
      const existingUser = await UserRepository.existsUserByEmail(email)

      if (existingUser) {
        throw new HttpException('Utilizador já existe.', StatusCodes.CONFLICT)
      }

      // Faz o hash da palavra-passe antes de a armazenar
      const hashedPassword = await hashPassword(password)

      const user = {
        name,
        birthDate,
        contact,
        email,
        password: hashedPassword
      }

      // Cria o novo utilizador na base de dados
      const createdUser = await UserRepository.createUser(user)

      if (!createdUser) {
        throw new HttpException('Não foi possível criar conta.', StatusCodes.BAD_REQUEST)
      }

      return response(res, true, StatusCodes.CREATED, createdUser)
    } catch (error) {
      handleError(error, res, 'Ocorreu um erro ao criar a conta. Tente novamente mais tarde.')
    }
  }

  /**
   * Efetua o login de um utilizador.
   * @param {Object} req - O objeto de pedido que contém as credenciais do utilizador.
   * @param {Object} res - O objeto de resposta utilizado para enviar a resposta.
   */
  static async loginUser (req, res) {
    const { email, password } = req.body

    try {
      // Verifica se o utilizador da base de dados pelo email
      const user = await UserRepository.existsUserByEmail(email)

      if (!user) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      // Compara a palavra-passe fornecida com a palavra-passe armazenada
      const isMatch = await comparePassword(password, user.Password)

      if (!isMatch) {
        throw new HttpException('Palavra-passe incorreta', StatusCodes.BAD_REQUEST)
      }

      const { Password: _, ...publicUser } = user

      // Envia os tokens criados
      sendToken(publicUser, StatusCodes.OK, res)
    } catch (error) {
      handleError(error, res, 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.')
    }
  }

  /**
   * Efetua o logout do utilizador.
   * @param {Object} req - O objeto de pedido.
   * @param {Object} res - O objeto de resposta utilizado para enviar a resposta.
   */
  static async logoutUser (req, res) {
    try {
      // Apaga os cookies que armazenam os tokens de acesso e refresh
      res.cookie('accessToken', '')
      res.cookie('refreshToken', '')

      return response(res, true, StatusCodes.OK, 'Logout realizado com sucesso.')
    } catch (error) {
      handleError(error, res, 'Ocorreu um erro ao fazer logout. Tente novamente mais tarde.')
    }
  }

  /**
   * Envia um email de ativação de conta ao utilizador.
   * @param {Object} req - O objeto de pedido que contém os dados do utilizador.
   * @param {Object} res - O objeto de resposta utilizado para enviar a resposta.
   */
  static async sendAccountActivationEmail (req, res) {
    const user = req.user

    // Cria o token de ativação e o código
    const activationToken = createActivationToken(user)

    const activationCode = activationToken.activationCode

    const emailData = { user, activationCode }

    try {
      // Prepara e envia o email de ativação
      await EmailService.prepareEmailContent('activation-mail.ejs', emailData)

      await EmailService.sendEmail({
        email: user.Email,
        subject: 'Ativação de conta',
        template: 'activation-mail.ejs',
        emailData
      })

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Verifique o seu email para ativar a conta.',
        activationToken: activationToken.token
      })
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao enviar o email para a sua conta.')
    }
  }

  /**
   * Ativa a conta do utilizador utilizando o token e o código de ativação fornecidos.
   * @param {Object} req - O objeto de pedido que contém o ID do utilizador e o token de ativação.
   * @param {Object} res - O objeto de resposta utilizado para enviar a resposta.
   */
  static async activateUser (req, res) {
    const id = req.user.Utilizador_ID

    const { activationToken, activationCode } = req.body

    try {
      // Verifica se o token ainda é válido
      const token = jwt.verify(activationToken, ACCESS_TOKEN_SECRET_KEY)

      // Verifica se o código de ativação coincide
      if (token.activationCode !== activationCode) {
        throw new HttpException('Código de ativação incorreto.', StatusCodes.BAD_REQUEST)
      }

      // Ativa a conta do utilizador na base de dados
      const user = await UserRepository.activateUser(id)

      if (!user) {
        throw new HttpException('Ocorreu erro ao ativar conta.', StatusCodes.BAD_REQUEST)
      }

      return response(res, true, StatusCodes.OK, 'Conta ativada com sucesso.')
    } catch (error) {
      handleError(error, res, 'Ocorreu um erro ao ativar a conta. Tente novamente mais tarde.')
    }
  }

  /**
   * Atualiza o token de acesso do utilizador usando o refresh token.
   * @param {Object} req - O objeto de pedido que contém o refresh token.
   * @param {Object} res - O objeto de resposta utilizado para enviar a resposta.
   * @param {Function} next - Função de middleware para a próxima ação.
   */
  static async refreshAccessToken (req, res) {
    const refreshToken = req.headers.refresh

    try {
      // Verifica se o refresh token existe
      if (!refreshToken) {
        throw new HttpException('Não foi possível encontrar a sessão. Tente mais tarde', StatusCodes.UNAUTHORIZED)
      }

      // Verifica se o refresh token ainda é válido
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY)

      // Verifica a expiração ou outros problemas com a sessão
      if (!decoded) {
        throw new HttpException('Sessão expirada. Faça login novamente.', StatusCodes.UNAUTHORIZED)
      }

      const user = { id: decoded.id }

      // Gera novos tokens de acesso e refresh
      sendToken(user, StatusCodes.OK, res)
    } catch (error) {
      handleError(error, res, 'Ocorreu um erro ao renovar sua sessão. Tente novamente mais tarde.')
    }
  }
}

export default AuthController
