module.exports = function error(message) {
  if (!message) {
    return
  }

  console.error(`Error: ${message}`)
  process.exit(1)
}
