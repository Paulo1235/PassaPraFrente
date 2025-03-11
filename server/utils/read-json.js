import path from 'path'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export const readJSON = (filePath) => {
  const absolutePath = path.resolve(filePath)

  return require(absolutePath)
}
