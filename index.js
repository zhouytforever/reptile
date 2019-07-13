const { insertMany, openAlbum } = require('./utils/mongo')
const FetchPics = require('./utils/common')

const baseURL = 'https://m1.luffav.com'
const firstPageUrl = '/art/type/id/8/page/209.html'

const hasNextPage = ($html, currentPath) => {
  return !/829\.html/.test(currentPath)
}

const titleProcessor = ($html) => {
  let temp = $html('title').text()
  let reg = /(.+)\s-/
  let result = reg.exec(temp)
  return result[1] || temp
}
const urlProcessor = ($html) => {
  const $imgs = $html('#wrapper > div:nth-child(6) > p:nth-child(9)  img')
  let result = []
  $imgs.each((i, e) => {
    result.push(e.attribs.src)
  })
  return result
}

const processor = async (pageUrl) => {
  try {
    const fetchPics = new FetchPics(baseURL, pageUrl)
    const list = await fetchPics.getPageList()
    let albumList = []
    for (let i = 0, len = list.length; i < len; i++) {
      let entity = await fetchPics.getDetailPage(
        list[i],
        titleProcessor,
        urlProcessor
      )
      if (entity.key === 'no_imgs') continue
      albumList.push(entity)
    }
    if (albumList.length === 0) throw new Error('没有数据')
    console.log('准备存入: ', albumList.map(e => e.title))
    // 存入数据库
    openAlbum((album) => insertMany(album, albumList))
    // 下一页
    if (fetchPics.hasNextPage(hasNextPage)) {
      let nextPagePath = fetchPics.nextPagePath(($page) =>
        $page('.page_info  a[title="下一页"]').attr('href'))
      setTimeout(() => processor(nextPagePath), 1000)
    }
  } catch (e) {
    console.log(e)
    process.exit()
  }
}
processor(firstPageUrl)
