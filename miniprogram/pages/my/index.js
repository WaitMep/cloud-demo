
Page({

  data: {
    imageSrc: '/images/my-bj.jpg',
    isAuthorized: false,
    userImg: ''
  },
  onCollection(event) {
    wx.showToast({
      title: '敬请期待...'
    })
  },
  // 跳转天气页面函数
  onWeather(event) {
    this._getLocation().then(res => {
       wx.navigateTo({
         url: `../weather/index?latitude=${res.latitude}&longitude=${res.longitude}`,
       })
    }, err => {
      wx.showToast({
        title: '请在"我的设置"允许获取位置',
        icon: 'none'
      })
    })
  },
  // 打开用户设置页面
  onSetting(event) {
    wx.openSetting({
      success: res => {
        this.setData({
          isAuthorized: res.authSetting['scope.userInfo'] || false
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onGetUserInfo(event) {
    // 当用户点击授权后会获取用户头像
    if (event.detail.userInfo) {
      this.setData({
        isAuthorized: true,
        userImg: event.detail.userInfo.avatarUrl
      })
    }
  },
  onLoad(options) {
    //设置导航条颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    // 获取当前用户是否授权
    this._getAuthorizedState().then(res => {
      // 用户授权后调用接口获取用户信息
      if (res) {
        this._getUserInfo().then(res => {
          this.setData({
            userImg: res.avatarUrl,
            isAuthorized: true
          })
        })
      }
    })
  },
  /**
   * 私有方法
   */
  _getAuthorizedState() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          resolve(res.authSetting['scope.userInfo'])
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },
  _getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: res => {
          resolve(res.userInfo)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },
  _getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
})