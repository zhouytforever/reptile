const MC = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'

const dbName = 'se'

const open = (operation) => MC.connect(url, { useNewUrlParser: true }, async (err, client) => {
  console.log('数据库已经连接')
  if (err) throw err
  await operation(client.db(dbName))
  console.log('操作完成，数据库关闭')
  client.close()
})

const openAlbum = (operation) => open((se) => {
  let album = se.collection('album')
  operation(album)
})

const insertOne = (album, obj) => {
  album.insertOne(obj)
}

const insertMany = (album, objs) => {
  album.insertMany(objs)
}

module.exports = {
  open,
  openAlbum,
  insertOne,
  insertMany
}
