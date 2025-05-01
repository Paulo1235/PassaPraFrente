import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { DIRNAME } from '../../config.js'

const require = createRequire(import.meta.url)

const NOTIFICATIONS_FILE = path.join(DIRNAME, 'src/storage/notifications.json')

class FileService {
  static readJSON (filePath) {
    const absolutePath = path.resolve(filePath)

    return require(absolutePath)
  }

  static readFile () {
    const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8')

    return JSON.parse(data || [])
  }

  static writeFile (data) {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(data, null, 2))
  }

  static save (data) {
    const notifications = FileService.readFile()

    const index = notifications.findIndex(n => n.id === data.id)

    if (index !== -1) {
      notifications[index] = data
    } else {
      notifications.push(data)
    }

    this.writeFile(notifications)
  }

  static get (id) {
    const notifications = FileService.readFile()

    return notifications.find(n => n.id === id)
  }

  static getAll () {
    return FileService.readFile()
  }
}
export default FileService
