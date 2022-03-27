const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const opts = require('command-line-args')([
  { name: 'port', alias: 'p', type: Number }
])

if (opts.port) {
  process.env.PORT = opts.port
}

if (!fs.existsSync(path.resolve(__dirname, '../public/build'))) {
  execSync('npm run build')
}

require('./')