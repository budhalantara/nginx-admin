const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const isValidDomain = require('is-valid-domain')
const generateNginxConfig = require('./generateNginxConfig')
const config = require('./config')

function initHTML(domain) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Hello</title>
</head>
<body>
  <p>Hello from ${domain}</p>
</body>
</html>`.trim()
}

function reload() {
  childProcess.exec('sudo nginx -t', (err, stdout, stderr) => {
    if (err) {
      throw err
    }
    const res = stdout || stderr
    if (res.indexOf('test is successful') > -1) {
      childProcess.exec('sudo nginx -s reload', (err, stdout, stderr) => {
        if (err) {
          throw err
        }
      })
    }
  })
}

module.exports = {
  list: () => {
    const {
      nginxSitesAvailablePath,
      nginxSitesEnabledPath
    } = config.load()
    const ls = fs.readdirSync(nginxSitesAvailablePath)
      .filter(x => !x.startsWith('.'))

    return ls.map(x => {
      const exist = fs.existsSync(path.resolve(nginxSitesEnabledPath, x))
      return {
        name: x,
        enabled: exist
      }
    })
  },

  new: (opts) => {
    const {
      nginxSitesAvailablePath,
      nginxSitesEnabledPath,
      nginxPublicHTMLBasePath,
      nginxSSLPath,
      phpVersion
    } = config.load()

    const fields = [
      'domain',
      'isUsingPHP',
      'rootType',
      'overwrite',
      'ssl',
      'proxyUrl'
    ]

    const _opts = {}
    fields.forEach(key => {
      _opts[key] = opts[key]
    })

    const {
      domain,
      ssl,
      rootType,
      proxyUrl,
      isUsingPHP,
      overwrite
    } = _opts

    if (!domain || !isValidDomain(domain)) {
      throw new Error('invalid domain')
    }

    const confAvailablePath = path.resolve(nginxSitesAvailablePath, domain)
    if (!overwrite && fs.existsSync(confAvailablePath)) {
      throw new Error(`vhost config is exist ${confAvailablePath}`)
    }

    let sslCertPath
    let sslKeyPath
    if (ssl) {
      sslCertPath = path.resolve(nginxSSLPath, ssl + '.pem')
      if (!fs.existsSync(sslCertPath)) {
        throw new Error('invalid ssl certificate')
      }

      sslKeyPath = path.resolve(nginxSSLPath, ssl + '.key')
      if (!fs.existsSync(sslKeyPath)) {
        throw new Error('invalid ssl private key')
      }
    }

    if (rootType === 'proxied' && !proxyUrl) {
      throw new Error('proxy url is required')
    }

    const publicHtmlPath = path.resolve(nginxPublicHTMLBasePath, domain)
    const conf = generateNginxConfig({
      domain,
      phpSupport: isUsingPHP === true && rootType !== 'proxied',
      phpVersion,
      rootType,
      rootPath: publicHtmlPath,
      proxyUrl,
      sslCertPath,
      sslKeyPath
    })
    const tmpPath = path.resolve(__dirname, '../tmp', domain)
    fs.writeFileSync(tmpPath, conf)

    const confEnabledPath = path.resolve(nginxSitesEnabledPath, domain)
    const userPassword = config.env.userPassword
    childProcess.execSync(`${userPassword ? `echo '${userPassword}' | sudo -S` : 'sudo'} cp '${tmpPath}' '${confAvailablePath}'`)
    childProcess.execSync(`sudo rm -f '${confEnabledPath}'`)
    childProcess.execSync(`sudo ln -s '${confAvailablePath}' '${confEnabledPath}'`)

    fs.rmSync(tmpPath)

    if (!fs.existsSync(publicHtmlPath)) {
      childProcess.execSync(`sudo mkdir '${publicHtmlPath}'`)
      childProcess.execSync(`sudo chown $USER:$USER '${publicHtmlPath}'`)
      fs.writeFileSync(path.resolve(publicHtmlPath, 'index.html'), initHTML(domain))
    }

    reload()
  },

  update: (name, opts) => {
    const {
      nginxSitesAvailablePath,
      nginxSitesEnabledPath
    } = config.load()

    const confAvailablePath = path.resolve(nginxSitesAvailablePath, name)
    const confEnabledPath = path.resolve(nginxSitesEnabledPath, name)

    const userPassword = config.env.userPassword
    if (opts.enabled === true && fs.existsSync(confAvailablePath) && !fs.existsSync(confEnabledPath)) {
      childProcess.execSync(`${userPassword ? `echo '${userPassword}' | sudo -S` : 'sudo'} ln -s '${confAvailablePath}' '${confEnabledPath}'`)
      reload()
    } else if (opts.enabled === false) {
      childProcess.execSync(`${userPassword ? `echo '${userPassword}' | sudo -S` : 'sudo'} rm -f '${confEnabledPath}'`)
      reload()
    }
  }
}
