module.exports = {
  isValidCertName(str) {
    const regex = /[^a-zA-Z0-9\-_.]/
    return !regex.test(str)
  }
}
