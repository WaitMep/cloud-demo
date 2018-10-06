
Page({
  data: {
    weatherDatas: [],
    city: '',
    tips: []
  },
  // 点击对应的图标跳到相应的提示信息页面
  onTips(event) {
    const TYPE = {
      cloth: 0,
      car: 1,
      fever: 2,
      play: 3,
      sun: 4
    }
    const index = TYPE[event.currentTarget.dataset.type] // 获取当前点击的tip
    const tip = this.data.tips[index]
    
    // 取到当天的天气信息
    const weather = this.data.weatherDatas[0].weather
    const wind = this.data.weatherDatas[0].wind
    const temperature = this.data.weatherDatas[0].temperature
    wx.navigateTo({
      url: `../tips/index?desc=${tip.des}&title=${tip.title+tip.zs}&wind=${wind}&temperature=${temperature}&weather=${weather}&text=${tip.tipt}`
    })
  },
  // 页面加载，获取用户信息
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '天气',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#7dc5eb',
    })
    const latitude = options.latitude
    const longitude = options.longitude
    this._getUserCity(latitude, longitude).then(res => {
      const city = res
      const data = {}
      data.city = city
      this.setData(data)
      this._getWeatherInfo(city).then(res => {
        const results = res.results[0]

        const weatherDatas = results.weather_data
        const tips = results.index

        this.setData({
          weatherDatas: weatherDatas,
          tips: tips
        })
        wx.hideNavigationBarLoading()
      })
    }, err => {
      wx.hideNavigationBarLoading()
    })

  },
  /**
   * 私有方法
   */
  _getUserCity(latitude, longitude) {
    const url = `https://api.map.baidu.com/geocoder/v2/?ak=kTkcznxAXPMdphBGq2eel8tEQWT0nS1a&location=${latitude},${longitude}&output=json`
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: res => {
          resolve(res.data.result.addressComponent.city)
        },
        fail: err => reject(err)
      })
    })
  },
  _getWeatherInfo(city) {
    return new Promise((resolve, reject) => {
      wx.request({
         url: `https://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=kTkcznxAXPMdphBGq2eel8tEQWT0nS1a`,
        success: res => {
          const ERR_OK = 0
          if (res.data.error !== ERR_OK) {
            reject()
            return
          }
          resolve(res.data)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
})
