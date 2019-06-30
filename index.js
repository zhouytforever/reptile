const axios = require('axios')
const {
  replacePage,
  getPageList,
  getDetailPageImgUrls
} = require('./utils/common')

const baseURL = 'https://m1.lukkav.com'
const basePageUrl = '/art/type/id/8/page/$$.html'

let ax = axios.create({ baseURL })

getPageList(ax, replacePage(basePageUrl, 1))
  .then(async (list) => {
    for (let i = 0, len = list.length; i < len; i++) {
      let { imgUrls, title } = await getDetailPageImgUrls(ax, list[i])
      if (imgUrls === undefined) throw new Error('imgUrls undefined')
      console.log(title)
      console.log()
      console.log(imgUrls)
      console.log()
    }
  })
  .catch(err => console.log(err))
