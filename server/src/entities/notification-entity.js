class Notification {
  constructor ({ id, message, userId, category, link = undefined, read = false, date = new Date().toISOString() }) {
    if (!message) throw new Error('Mensagem é obrigatória.')
    if (!userId) throw new Error('UserId é obrigatório.')
    if (!category) throw new Error('Categoria é obrigatória.')

    this.id = id
    this.message = message
    this.userId = userId
    this.category = category
    this.link = link
    this.read = read
    this.date = date
  }

  // markAsRead () {
  //   this.read = true
  // }
}

export default Notification
