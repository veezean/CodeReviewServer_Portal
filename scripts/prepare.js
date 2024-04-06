// import path from 'node:path'
// import fs from 'fs-extra'
// import { icons } from '@iconify-json/ep'

const path = require('node:path')
const fs = require('fs-extra')
const { icons } = require('@iconify-json/ep')

async function prepare() {
  const outputDir = path.resolve(process.cwd(), 'public/icons')
  await fs.ensureDir(outputDir)
  await fs.emptyDir(outputDir)
  await fs.writeJSON(
    path.resolve(outputDir, 'icons.json'),
    icons,
  )
}

prepare()
