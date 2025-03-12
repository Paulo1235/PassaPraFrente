import fs from 'node:fs'
import path from 'path'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export const readJSON = (filePath) => {
  const absolutePath = path.resolve(filePath)

  return require(absolutePath)
}

export const writeJSON = async ({ filePath, data }) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}
