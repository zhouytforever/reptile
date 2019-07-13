const $ = require('cheerio')
const axios = require('axios')

const requestLogger = (config) => {
  console.log('连接：', config.baseURL + config.url)
  return config
}
class FetchPics {
  constructor (baseURL, firstPath) {
    this.ax = axios.create({ baseURL })
    this.ax.interceptors.request.use(requestLogger, (e) => Promise.reject(e))
    this.$page = null
    this.path = firstPath
    this.pageList = []
  }
  replacePageURL (baseUrl, page) {
    return baseUrl.replace('$$', page)
  }
  nextPagePath (operator) {
    this.path = operator(this.$page, this.path)
    return this.path
  }
  hasNextPage (operator) {
    return operator(this.$page, this.path)
  }
  async getPageList (aimElementPath =
  'ul.ui-list > li > a') {
    try {
      const res = await this.ax.get(this.path)
      this.$page = $.load(res.data)
      this.pageList = this.$page(aimElementPath)
        .map((i, e) => e.attribs.href)
      return this.pageList
    } catch (err) {
      console.log(err)
      throw new Error('getPageList 出错中断')
    }
  }
  async getDetailPage (url,
    titleProcessor = ($html) => $html('title')[0].text(),
    urlProcessor = ($html) => ''
  ) {
    try {
      const res = await this.ax.get(url)
      let $html = $.load(res.data)
      let imgUrls = urlProcessor($html)
      return {
        imgUrls,
        title: titleProcessor($html),
        key: Array.isArray(imgUrls) && imgUrls.length > 0
          ? Buffer.from(imgUrls[0]).toString('base64')
          : 'no_imgs'
      }
    } catch (e) {
      console.log(e)
      throw new Error('getDetailPage 出错中断')
    }
  }
}
module.exports = FetchPics
