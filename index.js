const axios = require('axios')
const { insertMany, openAlbum } = require('./utils/mongo')
const {
  replacePage,
  getPageList,
  getDetailPageImgUrls
} = require('./utils/common')

const baseURL = 'https://m1.lukkav.com'
const basePageUrl = '/art/type/id/8/page/$$.html'

let ax = axios.create({ baseURL })

const getOnePage = (pageNum) => {
  getPageList(ax, pageNum)
    .then(async (list) => {
      let albumSets = []
      for (let i = 0, len = list.length; i < len; i++) {
        let { imgUrls, title } = await getDetailPageImgUrls(ax, list[i])
        if (imgUrls === undefined) throw new Error('imgUrls undefined')
        let realTitle = /(.*)\s*-/.exec(title)[1]
        albumSets.push({
          title: realTitle,
          pics: imgUrls
        })
      }
      openAlbum((album) => insertMany(album, albumSets))
    })
    .catch(err => console.log(err))
}

const region = { first: 1, last: 821 }

const getPages = async (current, last) => {
  if (current > last) {
    console.log('完成全部')
    return null
  } else {
    console.log(`加载第 ${current} 页`)
    await getOnePage(replacePage(basePageUrl, current))
    getPages(current + 1, last)
  }
}

getPages(region.first, region.last)
