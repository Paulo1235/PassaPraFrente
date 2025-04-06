function response (res, success, statusCodes, message) {
  res.status(statusCodes).json({
    success,
    message
  })
}

export default response
