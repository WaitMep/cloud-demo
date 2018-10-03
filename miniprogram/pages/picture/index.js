// import {PictureModule} from '../../modules/picture.js'
// const picture = new PictureModule()
let num = 1
let colLeftHeight = 0
let colRightHeight = 0
Page({

  data: {
    pictures: [],
    colLeft: [],
    colRight: [],
    loadingCount: 0,
    more: true,
    loading: false,
    loadedImg:0
  },
  // 已经加载完毕的图片大于5则隐藏loading
  A(event){
    this.data.loadedImg += 1
    if (this.data.loadedImg >= 5) {
      wx.hideLoading()
    }
  },
  onImageError(event){
    console.log(event)
    const loadingCount = this.data.loadingCount - 1
    const data = {
      loadingCount
    }
    if (!loadingCount) {
      data.pictures = []
    }
    this.setData(data)
  },
  onLoadIamge(event){
    const imageId = event.currentTarget.id
    const oWidth = event.detail.width
    const oHeight = event.detail.height
    const imgWidth = 350
    const scal = imgWidth / oWidth
    const imgHeight = oHeight * scal

    const images = this.data.pictures
    let imageObj = null
    for (let i of images)  {
      if(i.id == imageId) {
        imageObj = i
        imageObj.height = imgHeight
        break
      }
    }
    
    const colLeft = this.data.colLeft
    const colRight = this.data.colRight
    const loadingCount = this.data.loadingCount - 1

    if (imageObj) {
      if (colLeftHeight <= colRightHeight) {
        colLeftHeight += imgHeight
        colLeft.push(imageObj)
      } else {
        colRightHeight += imgHeight
        colRight.push(imageObj)
      }
    }

    const data = {
      colLeft,
      colRight,
      loadingCount
    }
    if (!loadingCount) {
      data.pictures = []
      this.data.loadedImg = 0
      // wx.hideLoading()
    }
    this.setData(data)  
  },
  loadMore(){
    if (!this.data.more) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
      return
    }
    if (this._islocking()) {
      return
    }
    wx.showLoading({
      title: 'loading...',
    })
    this._lock()
    wx.cloud.callFunction({
      name: 'getImages',
      data: {
        url: `https://www.apiopen.top/meituApi?page=${num}`
      }
    }).then(res => {
      // console.log(res.result.data)
      if (!res.result.data.length) {
        this.data.more = false
        wx.hideLoading()
        return
      }
      const pictures = []
      const baseId = "img-" + (+new Date())
      res.result.data.forEach((item, index) => {
        item.id = `${baseId}-${index}`
        pictures.push(item)
      })
      this.setData({
        pictures: pictures,
        loadingCount: pictures.length
      })
      this._unlock()
      // wx.hideLoading()
      num += 1
    })
  },
  _lock(){
    this.data.loading = true
  },
  _unlock(){
    this.data.loading = false
  },
  _islocking(){
    return this.data.loading
  },
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'getImages',
      data: {
        url:`https://www.apiopen.top/meituApi?page=${num}`
      }
    }).then(res => {
      const pictures = []
      const baseId = "img-" + (+new Date())
      res.result.data.forEach((item,index) => {
        item.id = `${baseId}-${index}`
pictures.push(item)
      })
      this.setData({
        pictures: pictures,
        loadingCount: pictures.length
      })
      num += 1
    })
  },
  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    this.loadMore()
  },
  onShareAppMessage: function () {
  }
})