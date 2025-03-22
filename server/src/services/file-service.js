import fs from 'node:fs'
import path from 'node:path'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export class FileService {
  static readJSON = (filePath) => {
    const absolutePath = path.resolve(filePath)

    return require(absolutePath)
  }

  static writeJSON = (filePath, data) => {
    if (!data) console.error('Data not defined!')

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  }
}
