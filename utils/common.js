const $ = require('cheerio')

module.exports = {
  replacePage: (baseUrl, page) => baseUrl.replace('$$', page),
  getPageList: (ax, url) => ax.get(url)
    .then((res) => {
      let evary = []
      let html = $.load(res.data)
      html('ul.ui-list > li > a').each(function () {
        evary.push($(this).attr('href'))
      })
      return evary
    })
    .catch((err) => {
      console.log(err)
    }),
  getDetailPageImgUrls: (ax, url) => ax.get(url)
    .then((res) => {
      let imgUrls = []
      let html = $.load(res.data)
      html('#wrapper > div:nth-child(6) > p:nth-child(8) img').each(function (i, e) {
        imgUrls.push(e.attribs.src)
      })
      return {
        imgUrls,
        title: html('title').text()
      }
    })
    .catch(e => console.log(e))
}
