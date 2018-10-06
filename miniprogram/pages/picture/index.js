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
    loadedImg: 0,
  },
  // 点击图片预览当前加载完成的图片
  onBigImages(event) {
    const imageId = event.currentTarget.id
    const images = this.data.colLeft.concat(this.data.colRight)
    let imageObj = null
    for (let image of images) {
      if (image.id === imageId) {
        imageObj = image
        break
      }
    }
    const urls = []
    for (let i of images) {
      urls.push(i.url)
    }
    if(imageObj) {
      wx.previewImage({
        current: imageObj.url,
        urls: urls
      })
    }
  },
  // 已经加载完毕的图片大于10则隐藏loading 
  A(event) {
    this.data.loadedImg += 1
    if (this.data.loadedImg >= 10) {
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '宅逗趣',
      })
    }
  },
  // 图片加载出错
  onImageError(event) {
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
  // 图片加载成功后执行函数
  onLoadIamge(event) {
    const imageId = event.currentTarget.id 
    const oWidth = event.detail.width // 图片原始宽度
    const oHeight = event.detail.height // 图片原始高度
    const imgWidth = 350 // 设置图片宽度
    const scal = imgWidth / oWidth // 图片缩放比例
    const imgHeight = oHeight * scal // 图片实际高度

    const images = this.data.pictures // 要显示的图片
    let imageObj = null
    for (let i of images) {
      if (i.id == imageId) {
        imageObj = i
        imageObj.height = imgHeight
        break
      }
    }

    const colLeft = this.data.colLeft
    const colRight = this.data.colRight
    const loadingCount = this.data.loadingCount - 1

    // 判断图片是在左边显示还是右边显示
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
    // 图片要加载数量为0,清空pictures
    if (!loadingCount) {
      data.pictures = []
      this.data.loadedImg = 0
    }
    this.setData(data)
  },

  loadMore() {
    if (!this.data.more) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
      wx.setNavigationBarTitle({
        title: '宅逗趣',
      })
      return
    }
    if (this._islocking()) {
      return
    }
    // show loading and bar title
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '加载中...',
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
        wx.hideNavigationBarLoading()
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
      num += 1
    }, err => {
      // 请求失败隐藏加载条
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '宅逗趣',
      })
    })
  },
  //实现加载时避免发生相同请求加载重复内容
  _lock() {
    this.data.loading = true
  },
  _unlock() {
    this.data.loading = false
  },
  _islocking() {
    return this.data.loading
  },
  onLoad: function(options) {
    //设置导航条颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    wx.showLoading({
      title: '客官请稍候...',
    })
    wx.cloud.callFunction({
      name: 'getImages',
      data: {
        url: `https://www.apiopen.top/meituApi?page=${num}`
      }
    }).then(res => {
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
      wx.hideLoading()
      num += 1
    })
  },
  // 生命周期函数，页面被隐藏
 onShow(event) {
    wx.hideNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '宅逗趣',
    })
  },
  // 下拉加载更多图片
  onReachBottom: function() {
    this.loadMore()
  }
})