export function response (res, success, statusCodes, message) {
  return res.status(statusCodes).json({
    success,
    message
  })
}
