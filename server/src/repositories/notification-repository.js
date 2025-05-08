import sql from 'mssql'
import { dbConfig, getConnection } from '../database/db-config.js'

class NotificationRepository {
  static async createNotification (data) {
    const pool = await getConnection(dbConfig)

    const notification = await pool
      .request()
      .input('message', sql.VarChar, data.message)
      .input('category', sql.VarChar, data.category)
      .input('link', sql.VarChar, data.link)
      .input('read', sql.Bit, data.read)
      .input('date', sql.DateTime, data.date)
      .input('userId', sql.Int, data.userId)
      .query(`
        INSERT INTO Notificacao (Mensagem, Categoria, Link, Lida, Data, Utilizador_ID)
        VALUES (@message, @category, @link, @read, @date, @userId)
      `)

    return notification.rowsAffected[0] > 0
  }

  static async getNotificationById (id) {
    const pool = await getConnection(dbConfig)

    const notification = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT Notificacao_ID, Mensagem, Categoria, Link, Lida, Data, Utilizador_ID
        FROM Notificacao
        WHERE Notificacao_ID = @id
      `)

    return notification.recordset[0]
  }

  static async getAllNotifications () {
    const pool = await getConnection(dbConfig)

    const notifications = await pool
      .request()
      .query(`
        SELECT * 
        FROM Notificacao
      `)

    return notifications.recordset
  }

  static async getUserNotifications (userId) {
    const pool = await getConnection(dbConfig)

    const userNotifications = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT Notificacao_ID, Mensagem, Categoria, Link, Lida, Data
        FROM Notificacao
        WHERE Utilizador_ID = @userId
      `)

    return userNotifications.recordset
  }

  static async markAsRead (id) {
    const pool = await getConnection(dbConfig)

    const updatedNotification = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE Notificacao
        SET Lida = 1
        WHERE Notificacao_ID = @id
      `)

    return updatedNotification.rowsAffected[0] > 0
  }

  static async getUnreadNotificationsByUser (userId) {
    const pool = await getConnection(dbConfig)

    const unreadNotifications = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT Notificacao_ID, Mensagem, Categoria, Link, Lida, Data
        FROM Notificacao
        WHERE Utilizador_ID = @userId AND Lida = 0
      `)

    return unreadNotifications.recordset
  }

  static async getReadNotificationsByUser (userId) {
    const pool = await getConnection(dbConfig)

    const readNotifications = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT Notificacao_ID, Mensagem, Categoria, Link, Lida, Data
        FROM Notificacao
        WHERE Utilizador_ID = @userId AND Lida = 1
      `)

    return readNotifications.recordset
  }
}

export default NotificationRepository
