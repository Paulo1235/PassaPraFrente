import { randomUUID } from 'node:crypto'

import { readJSON, writeJSON } from '../utils/file-helper.js'

export class UserRepository {
  static async loadUsers () {
    return await readJSON('users.json')
  }

  static async getUserById (id) {
    const users = await this.loadUsers()

    return users.find(user => user.id === id)
  }

  static async getAllUsers () {
    return await this.loadUsers()
  }

  static async createUser (input) {
    const newUser = {
      id: randomUUID(),
      ...input
    }

    writeJSON('users.json', newUser)

    return newUser
  }

  static async deleteUser (id) {
    const users = await this.loadUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)

    writeJSON('users.json', userIndex)

    return true
  }

  static async updateUser ({ id, input }) {
    const users = await this.loadUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    users[userIndex] = {
      ...users[userIndex],
      ...input
    }

    writeJSON('users.json', users)

    return users[userIndex]
  }
}
