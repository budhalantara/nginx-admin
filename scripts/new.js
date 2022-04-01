const inquirer = require('inquirer')
const vhost = require('../lib/vhost')
const config = require('../lib/config')
const error = require('../lib/error')

try {
  config.validate()
} catch ({ message }) {
  error(message)
}

const questions = [
  {
    type: 'input',
    name: 'domain',
    message: 'Domain: ',
    default: 'test',
    validate(value) {
      return !!value || 'domain cannot be null'
    }
  },
  {
    type: 'confirm',
    name: 'isUsingPHP',
    message: 'PHP support: ',
    default: true
  },
  {
    type: 'list',
    name: 'rootType',
    message: 'Root path type: ',
    default: 'Regular Files',
    choices: [
      { name: 'Regular Files', value: 'regular' },
      { name: 'Single Page Application', value: 'spa' },
      { name: 'Proxied', value: 'proxied' }
    ]
  }
]

inquirer.prompt(questions).then(answers => {
  vhost.new(answers)
})
