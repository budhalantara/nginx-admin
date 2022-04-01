require('dotenv').config()
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const inquirer = require('inquirer')

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

if (!fs.existsSync(path.resolve(__dirname, 'web/public/build'))) {
  execSync('npm run build')
}

async function main() {
  if (!process.env.USER_PASSWORD) {
    const { password } = await inquirer.prompt([{
      type: 'password',
      name: 'password',
      message: 'user password (sudoers): ',
      mask: '*'
    }])
    process.env.USER_PASSWORD = password
  }
  require('./web/api')
}

main()
