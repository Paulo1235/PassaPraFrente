import { StatusCodes } from 'http-status-codes'

export class ErrorApplication extends Error {
  constructor (message, statusCodes) {
    super(message)
    this.statusCodes = statusCodes || StatusCodes.INTERNAL_SERVER_ERROR
  }
}
