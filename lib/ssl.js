const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const {
  validateSSLCert,
  validateSSLKey
} = require('ssl-validator')
const config = require('./config')
const validator = require('./validator')

module.exports = {
  list: () => {
    const { nginxSSLPath } = config.load()
    const ls = fs.readdirSync(nginxSSLPath)
    const domains = ls.filter(x => x.split('.')
      .pop() === 'pem')
      .map(x => x.replace('.pem', ''))

    return domains
  },

  get: (name) => {
    const { nginxSSLPath } = config.load()
    let pem
    let key
    for (const x of fs.readdirSync(nginxSSLPath)) {
      if (!pem && x === name + '.pem') {
        pem = x
      } else if (!key && x === name + '.key') {
        key = x
      }

      if (pem && key) {
        break
      }
    }

    return {
      name,
      cert: {
        content: !pem ? '' : fs.readFileSync(path.resolve(nginxSSLPath, pem)).toString() || ''
      },
      key: {
        content: !key ? '' : fs.readFileSync(path.resolve(nginxSSLPath, key)).toString() || ''
      }
    }
  },

  new: async (opts) => {
    const { nginxSSLPath } = config.load()

    const fields = [
      'name',
      'certificate',
      'privateKey'
    ]

    const _opts = {}
    fields.forEach(key => {
      _opts[key] = opts[key]
    })

    const {
      name,
      certificate,
      privateKey
    } = _opts

    if (!name || !validator.isValidCertName(name)) {
      throw new Error('invalid ssl name')
    }

    if (fs.existsSync(path.resolve(nginxSSLPath, name + '.pem'))) {
      throw new Error('ssl is exist')
    }

    try {
      await validateSSLCert(certificate)
    } catch (error) {
      throw new Error('invalid ssl certificate')
    }

    try {
      await validateSSLKey(privateKey)
    } catch (error) {
      throw new Error('invalid ssl private key')
    }

    const tmpPemPath = path.resolve(__dirname, '../tmp', name + '.pem')
    const tmpKeyPath = path.resolve(__dirname, '../tmp', name + '.key')
    await Promise.all([
      fs.promises.writeFile(tmpPemPath, certificate),
      fs.promises.writeFile(tmpKeyPath, privateKey)
    ])

    const userPassword = config.env.userPassword

    const pemPath = path.resolve(nginxSSLPath, name + '.pem')
    const keyPath = path.resolve(nginxSSLPath, name + '.key')
    childProcess.execSync(`${userPassword ? `echo '${userPassword}' | sudo -S` : 'sudo'} cp '${tmpPemPath}' '${pemPath}'`)
    childProcess.execSync(`sudo cp '${tmpKeyPath}' '${keyPath}'`)

    await Promise.all([
      fs.promises.rm(tmpPemPath),
      fs.promises.rm(tmpKeyPath)
    ])
  }
}
