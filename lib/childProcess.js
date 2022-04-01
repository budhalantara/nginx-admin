const { promisify } = require('util')
const childProcess = require('child_process')

module.exports = {
  exec: promisify(childProcess.exec)
}
