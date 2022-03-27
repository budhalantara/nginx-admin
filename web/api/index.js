const path = require('path')
const net = require('net')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const serveStatic = require('koa-static')

const app = new Koa()

app.use(bodyParser())
app.use(serveStatic(path.resolve(__dirname, '../public')))
app.use(require('./router').routes())

function getPort(cb) {
  const port = process.env.PORT || 4123
  const server = net.createServer()

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      server.listen(0)
    } else {
      throw err
    }
  })
  
  server.on('listening', () => {
    const newPort = server.address().port
    server.close()
    if (newPort != port) {
      console.log(`Port ${port} is taken, using ${newPort} instead\n`)
    }
    cb(newPort)
  })

  server.listen(port)
}

getPort((port) => {
  const host = process.env.HOST || 'localhost'
  app.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`)
  })
})