import jwt from 'jsonwebtoken'

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET_KEY
} from '../../config.js'

// export const tokenOptions = {
//   secure: NODE_ENV === 'production',
//   httpOnly: true,
//   sameSite: 'strict'
// }

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

  res.setHeader('authorization', `Bearer ${accessToken}`)
  res.setHeader('refresh', refreshToken)

  // res.cookie('accessToken', accessToken, tokenOptions)
  // res.cookie('refreshToken', refreshToken, tokenOptions)

  return res.status(statusCodes).json({
    success: true,
    user
  })
}
