const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const opts = require('command-line-args')([
  { name: 'port', alias: 'p', type: Number },
  { name: 'expose', alias: 'e', type: Boolean }
])

if (opts.port) {
  process.env.PORT = opts.port
}

if (opts.expose) {
  process.env.HOST = '0.0.0.0'
}

if (!fs.existsSync(path.resolve(__dirname, '../public/build'))) {
  execSync('npm run build')
}

require('./')