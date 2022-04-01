require('dotenv').config()
const fs = require('fs')
const path = require('path')

const userPassword = process.env.USER_PASSWORD
if (!userPassword) {
  throw new Error('env: USER_PASSWORD is empty')
}

module.exports = {
  env: {
    userPassword
  },

  load() {
    const configPath = path.resolve(__dirname, '../config.json')
    if (!fs.existsSync(configPath)) {
      throw new Error('please configure')
    }
    const config = JSON.parse(fs.readFileSync(configPath))
    const result = {
      nginxSitesAvailablePath: config.nginxSitesAvailablePath || '/etc/nginx/sites-available',
      nginxSitesEnabledPath: config.nginxSitesEnabledPath || '/etc/nginx/sites-enabled',
      nginxPublicHTMLBasePath: config.nginxPublicHTMLBasePath || '/var/www',
      nginxSSLPath: config.nginxSSLPath || '/etc/ssl',
      phpVersion: config.phpVersion
    }
    this.validate(result)
    return result
  },

  save(config) {
    const fields = [
      'nginxSitesAvailablePath',
      'nginxSitesEnabledPath',
      'nginxPublicHTMLBasePath',
      'nginxSSLPath',
      'phpVersion'
    ]

    const _config = {}
    fields.forEach(key => {
      _config[key] = config[key]
    })

    this.validate(_config)

    fs.writeFileSync(path.resolve(__dirname, '../config.json'), JSON.stringify(_config, null, 2))
  },

  validate(config) {
    if (!config) {
      config = this.load()
    }

    const fields = [
      'nginxSitesAvailablePath',
      'nginxSitesEnabledPath',
      'nginxPublicHTMLBasePath',
      'nginxSSLPath'
    ]

    fields.forEach(key => {
      if (!fs.existsSync(config[key])) {
        throw new Error(`no such file or directory ${config[key]}`)
      }
    })
  }
}
