import bcrypt from 'bcrypt'
import StatusCodes from 'http-status-codes'

import { ErrorApplication } from './error-handler.js'
import { SALT_ROUNDS } from '../../config.js'

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    return hashedPassword
  } catch (error) {
    console.error('Error hashing password:', error.message)
    throw new ErrorApplication('Failed to hash password', StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)

    return isMatch
  } catch (error) {
    console.error('Error while comparing password:', error.message)
    throw new ErrorApplication('Error in password comparison', StatusCodes.INTERNAL_SERVER_ERROR)
  }
}
