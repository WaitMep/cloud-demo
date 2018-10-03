import {HTTP} from '../utils/http.js'
const http = new HTTP()
class PictureModule{

  getPicture(num=1){
    const url = `https://www.apiopen.top/meituApi?page=${num}`
    return http.request({
      url: url
    })
  }
}

export{
  PictureModule
}