const Router = require('@koa/router')
const router = new Router()
const config = require('../../core/lib/config')
const vhost = require('../../core/lib/vhost')
const ssl = require('../../core/lib/ssl')

router.get('/api/config', (ctx) => {
  try {
    ctx.body = {
      success: true,
      data: config.load()
    }
  } catch (error) {
    if (error.message !== 'please configure') {
      console.log(error)
    }
    ctx.body = {
      success: false,
      message: error.message
    }
    return
  }
})

router.put('/api/config', (ctx) => {
  try {
    config.save(ctx.request.body)
    ctx.body = {
      success: true,
      message: 'config saved'
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: error.message
    }
    return
  }
})

router.get('/api/vhost', (ctx) => {
  try {
    const data = vhost.list()
    ctx.body = {
      success: true,
      data
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: error.message
    }
    return
  }
})

router.post('/api/vhost', (ctx) => {
  try {
    config.validate()
    vhost.new(ctx.request.body)
    ctx.body = {
      success: true,
      message: 'new vhost created'
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: error.message
    }
    return
  }
})

router.put('/api/vhost/:name', (ctx) => {
  try {
    const { enabled } = ctx.request.body
    vhost.update(ctx.params.name, { enabled })
    ctx.body = {
      success: true,
      message: 'vhost updated'
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: error.message
    }
    return
  }
})

router.get('/api/ssl', (ctx) => {
  try {
    const data = ssl.list()
    ctx.body = {
      success: true,
      data
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: error.message
    }
  }
})

router.post('/api/ssl', async (ctx) => {
  try {
    const data = await ssl.new(ctx.request.body)
    ctx.body = {
      success: true,
      data
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: error.message
    }
  }
})

router.get('/api/ssl/:name', (ctx) => {
  try {
    const data = ssl.get(ctx.params.name)
    ctx.body = {
      success: true,
      data
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: error.message
    }
  }
})

module.exports = router