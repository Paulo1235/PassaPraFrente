import { StatusCodes } from 'http-status-codes'
import chalk from 'chalk'

import response from './response.js'

class HttpException extends Error {
  constructor (message, statusCodes) {
    super(message)
    this.statusCodes = statusCodes || StatusCodes.INTERNAL_SERVER_ERROR
  }
}

const handleError = (res, error, defaultMessage) => {
  console.log(chalk.red.bold('Erro interno: '), chalk.yellow(error.message))

  if (error instanceof HttpException) {
    return response(res, false, error.statusCodes, error.message)
  }
  return response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, defaultMessage)
}

export { HttpException, handleError }
