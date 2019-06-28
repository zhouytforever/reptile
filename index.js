const Koa = require('koa')
const Vue = require('vue')
const rdr = require('vue-server-renderer').createRenderer()
const app = new Koa();

const render = (html) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>后端</title>
  </head>
  <body>${html}<body>
</html>
`
app.use(async ctx => {

  const vue = new Vue({
    template: `<div>Hello world</div>`
  })

  try {
    const html = await rdr.renderToString(vue) 
    ctx.body = render(html)
  } catch (err) {
    ctx.body = render(err.toString() || '程序出错')
  }
});

process.on('SIGINT', () => {
  console.log('stoping...')
  process.exit()
})
app.listen(3000)

