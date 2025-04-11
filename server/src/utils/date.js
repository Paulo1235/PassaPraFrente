function convertUTCToLocalISOString (utcDate) {
  const date = new Date(utcDate)

  const offset = date.getTimezoneOffset()

  date.setMinutes(date.getMinutes() - offset)

  return date.toISOString()
}

export default convertUTCToLocalISOString
