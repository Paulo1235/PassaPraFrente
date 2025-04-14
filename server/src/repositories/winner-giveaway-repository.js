import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class WinnerGiveawayRepository {
  static async createWinnerGiveaway (data) {
    const pool = await getConnection()

    const winnerGiveaway = await pool.request()
      .input('userId', sql.Int, data.userId)
      .input('giveawayId', sql.Int, data.id)
      .query(`
        INSERT INTO VencedorSorteio (Nota, InscricaoSorteioUtilizadorUtilizador_ID, InscricaoSorteioSorteioSorteio_ID) 
        VALUES (0, @userId, @giveawayId)
      `)

    return winnerGiveaway.rowsAffected[0] > 0
  }

  static async getWinnerGiveawayById (id) {
    const pool = await getConnection()

    const winnerGiveaway = await pool.request()
      .input('giveawayId', sql.Int, id)
      .query(`
        SELECT * 
        FROM VencedorSorteio 
        WHERE InscricaoSorteioSorteioSorteio_ID = @giveawayId
      `)

    return winnerGiveaway.recordset[0]
  }

  static async getAllWinnersGiveaways () {
    const pool = await getConnection()

    const winnersGiveaways = await pool
      .request()
      .query(`
        SELECT *
        FROM VencedorSorteio
      `)

    return winnersGiveaways.recordset
  }

  static async getAllWinnersGiveawaysByUserId (userId) {
    const pool = await getConnection()

    const winnersGiveaways = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT * 
        FROM VencedorSorteio 
        WHERE InscricaoSorteioUtilizadorUtilizador_ID = @userId
      `)

    return winnersGiveaways.recordset
  }

  static async updateGiveawayReview (id, review) {
    const pool = await getConnection()

    const updatedGiveaway = await pool
      .request()
      .input('giveawayId', sql.Int, id)
      .input('review', sql.Int, review)
      .query(`
        UPDATE VencedorSorteio
        SET Nota = @review
        WHERE InscricaoSorteioSorteioSorteio_ID = @giveawayId
      `)

    return updatedGiveaway.rowsAffected[0] > 0
  }
}

export default WinnerGiveawayRepository
