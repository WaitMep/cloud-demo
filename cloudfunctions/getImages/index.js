// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async(event, context) => {
  let result
  const request = require('request')
  return new Promise((resolve, reject) => {
    try {
      request(event.url, (err, resp, body) => {
        if (err) {
          return reject(err)
        }
        return resolve(JSON.parse(body))
      })
    } catch (e) {
      return reject(err)
    }
  })
}