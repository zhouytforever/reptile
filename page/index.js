const Vue = require('vue')

const app = new Vue({
  template: `<div>Hello world</div>`
})

const rdr = require('vue-server-renderer').createRenderer()

rdr.renderToString(app).then(html => {
  console.log(html)
}).catch(err => {
  console.log(err)
})


