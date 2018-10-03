// miniprogram/pages/bookDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: [],
    added: false,
    read: false
  },
  onQuery(bid) {
    const db = wx.cloud.database()
    db.collection('recommend').where({
      recommend: 1
    }).get().then(res => {
      const book = this.searchBook(res.data[0].recommend_book, bid)
      this.setData({
        book: book
      })
    }, err => console.log(err))
  },

  searchData(collectionName, key, value) {
    const db = wx.cloud.database()
    return db.collection(collectionName).where({
      [key]: value
    }).get()
  },

  searchBook(array, bid) {
    let book = {}
    array.forEach(item => {
      if (bid == item.id) {
        book = item
      }
    })
    return book || {}
  },
  onAddBook(event) {
    const db = wx.cloud.database()
    db.collection('recommend').add({
      data: {
        added: event.detail.state
      }
    }).then(res => {
      console.log(res)
    }, err => console.log(err))
  },

  onRead(event) {
    const db = wx.cloud.database()
    db.collection('recommend').add({
      data: {
        read: event.detail.state
      }
    }).then(res => {
      console.log(res)
    }, err => console.log(err))
  },

  onLoad(options) {
    const bid = options.bid
    this.onQuery(bid)

    this.searchData('recommend', 'added', true).then(res => {
      if (typeof res.data[0] === 'undefined') {
        return
      }
      this.setData({
        added: res.data[0].added
      })
    }, err => console.log(err))

    this.searchData('recommend', 'read', true).then(res => {
      if (typeof res.data[0] === 'undefined') {
        return
      }
      this.setData({
        read: res.data[0].read
      })
    })
  },
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})