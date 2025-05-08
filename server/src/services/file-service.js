import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

class FileService {
  static readJSON (filePath) {
    const absolutePath = path.resolve(filePath)

    return require(absolutePath)
  }
}
export default FileService
