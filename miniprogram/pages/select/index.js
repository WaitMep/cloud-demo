// miniprogram/pages/select/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendBooks: [],
    loading: false
  },
  loadMore(num){
    if(this.data.loading) {
      return
    }
    this.data.loading = true
    const db = wx.cloud.database()
    db.collection('books').skip(num).limit(10).get().then(res => {
      this.setData({
        recommendBooks: this.data.recommendBooks.concat(this._format(res.data))
      })
      this.data.loading = false
    }, err => {
      console.log(err)
      this.data.loading = false
    })
  },
  onVisitDetail(event) {
    const bid = event.detail.bid
    console.log('visit', event.detail.bid)
    wx.navigateTo({
      url: `../bookDetail/index?bid=${bid}`,
    })
  },
  _limit(str){
    str = str.replace('展开>>', '')
    return str.substr(3, 53) + '...'
  },
  _format(datas){
    const books = []
    for(let item of datas) {
      const book = {
        author: item.author,
        image: item.image,
        description: this._limit(item.description),
        title: item.title
      }
      books.push(book)
    }
    return books || []
  },
  loadData() {
    const db = wx.cloud.database()
    db.collection('books').limit(10).get().then(res => {
      this.setData({
        recommendBooks: this._format(res.data)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    this.loadMore(this.data.recommendBooks.length)
  },
  
  onShareAppMessage: function () {

  }
})