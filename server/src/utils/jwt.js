import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET_KEY,
  NODE_ENV,
  ACTIVATION_CODE_EXPIRE
} from '../../config.js'

export const tokenOptions = {
  secure: NODE_ENV === 'production',
  httpOnly: false,
  sameSite: 'strict'
}

export const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.Utilizador_ID },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: ACCESS_TOKEN_EXPIRE * 60 }
  )

  return accessToken
}

export const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { id: user.Utilizador_ID },
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: REFRESH_TOKEN_EXPIRE * 60 * 60 }
  )

  return refreshToken
}

export const sendToken = (user, statusCodes, res) => {
  const accessToken = generateAccessToken(user)

  const refreshToken = generateRefreshToken(user)

  res.cookie('accessToken', accessToken, tokenOptions)
  res.cookie('refreshToken', refreshToken, tokenOptions)

  return res.status(statusCodes).json({
    success: true,
    user
  })
}

export const createActivationToken = (user) => {
  const activationCode = crypto.randomInt(1000, 10000).toString()

  const token = jwt.sign(
    { user, activationCode },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: ACTIVATION_CODE_EXPIRE * 60 * 60 }
  )

  return { token, activationCode }
}
