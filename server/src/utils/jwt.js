import jwt from 'jsonwebtoken'

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET_KEY,
  NODE_ENV
} from '../../config.js'

const tokenOptions = {
  secure: NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict'
}

export const sendToken = (user, statusCodes, res) => {
  const accessToken = jwt.sign(
    { id: user.Utilizador_ID },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: ACCESS_TOKEN_EXPIRE * 60 }
  )

  const refreshToken = jwt.sign(
    { id: user.Utilizador_ID },
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: REFRESH_TOKEN_EXPIRE * 60 * 60 }
  )

  res.cookie('accessToken', accessToken, tokenOptions)
  res.cookie('refreshToken', refreshToken, tokenOptions)

  return res.status(statusCodes).json({
    success: true,
    user,
    accessToken
  })
}
