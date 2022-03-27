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

module.exports = {
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
  }
}
