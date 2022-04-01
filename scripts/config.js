const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const questions = [
  {
    type: 'input',
    name: 'nginxSitesAvailablePath',
    message: 'NGINX sites-available path: ',
    default: '/etc/nginx/sites-available'
  },
  {
    type: 'input',
    name: 'nginxSitesEnabledPath',
    message: 'NGINX sites-enabled path: ',
    default: '/etc/nginx/sites-enabled'
  },
  {
    type: 'input',
    name: 'nginxPublicHTMLBasePath',
    message: 'NGINX public_html base path: ',
    default: '/var/www'
  },
  {
    type: 'input',
    name: 'nginxSSLPath',
    message: 'NGINX SSL path: ',
    default: '/etc/ssl'
  },
  {
    type: 'input',
    name: 'phpVersion',
    message: 'PHP Version: ',
    default: '7.4'
  }
]

inquirer.prompt(questions).then(answers => {
  fs.writeFileSync(path.resolve(__dirname, '../config.json'), JSON.stringify(answers, null, 2))
})
