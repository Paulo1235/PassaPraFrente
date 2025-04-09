class Notification {
  constructor ({ id, message, userId, read = false, date = new Date().toISOString() }) {
    if (!message) throw new Error('Mensagem é obrigatória.')
    if (!userId) throw new Error('UserId é obrigatório.')

    this.id = id
    this.message = message
    this.userId = userId
    this.read = read
    this.date = date
  }

  // markAsRead () {
  //   this.read = true
  // }
}

export default Notification
