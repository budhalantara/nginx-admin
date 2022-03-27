const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const serveStatic = require('koa-static')

const app = new Koa()

app.use(bodyParser())
app.use(serveStatic(path.resolve(__dirname, '../public')))
app.use(require('./router').routes())

function getPort() {
  let port = process.env.PORT || 4123

  return port
}

const port = getPort()
app.listen(port, () => {
  console.log(`listening on ${port}`)
})