import {
  HTTP
} from '../utils/http.js'
const http = new HTTP()
class BookModule {

  getRecommedBooks() {
    const url = `https://www.apiopen.top/novelApi`
    return http.request({
      url: url
    })
  }

  searchBook(q) {
    const url = `https://www.apiopen.top/novelSearchApi?name=${q}`
    return http.request({
      url: url
    })
  }

  getBookDetail(q) {
    const url = `https://www.apiopen.top/novelInfoApi?name=${q}`
    return http.request({
      url: url
    })
  }
}

export {
  BookModule
}