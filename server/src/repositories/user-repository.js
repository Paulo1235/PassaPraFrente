import { randomUUID } from 'node:crypto'

import { readJSON, writeJSON } from '../utils/file-helper.js'

export class UserRepository {
  static async loadUsers () {
    return await readJSON('users.json') || []
  }

  static async getUserById (id) {
    const users = await this.loadUsers()

    return users.find(user => user.id === id)
  }

  static async getAllUsers () {
    return await this.loadUsers()
  }

  static async createUser (input) {
    const users = await this.loadUsers()
    const newUser = {
      id: randomUUID(),
      ...input
    }

    users.push(newUser)

    await writeJSON('users.json', users)

    return newUser
  }

  static async deleteUser (id) {
    const users = await this.loadUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)

    await writeJSON('users.json', users)

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

    await writeJSON('users.json', users)

    return users[userIndex]
  }
}
