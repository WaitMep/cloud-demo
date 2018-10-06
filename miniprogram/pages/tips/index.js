// miniprogram/pages/tips/index.js
Page({
  data: {
    title: '',
    weather: '',
    temperature: '',
    wind: '',
    desc: ''
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.text,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#7dc5eb',
    })
    this.setData({
      desc: options.desc,
      temperature: options.temperature,
      weather: options.weather,
      title: options.title,
      wind: options.wind
    })
  }
})