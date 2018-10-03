import { HTTP } from '../utils/http.js'
const http = new HTTP()
class ContentModule {
  // type = 1 : 全部
  // type = 2 : 文字
  // type = 3 : 图片
  // type = 4 : 视频
  // page = 1: 页码


  getContent(num=1, type=4) {
    const url = `https://www.apiopen.top/satinApi?type=${type}&page=${num}`
    return http.request({
      url: url
    })
  }
}

export {
  ContentModule
}