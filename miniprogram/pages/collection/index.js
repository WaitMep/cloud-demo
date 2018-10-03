import {BookModule} from '../../modules/book.js'
const book = new  BookModule()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searching: false,
    books: [],
    index: null
  },
  onSearch(event) {
    this.setData({
      searching: true
    })
  },
  onNavigateTo(event) {
    const bid = event.detail.bid
    wx.navigateTo({
      url: `../bookDetail/index?bid=${bid}`,
    })
  },
  onCancel(event) {
    this.setData({
      searching: false
    })
  },
  onAddBook(event) {
    wx.navigateTo({
      url: '../select/index',
    })
  },
  onLongTap(event) {
    const index = event.detail.index
    wx.showModal({
      title: '删除本书',
      success: (res) => {
        if (res.confirm) {
          const tempArray = this.data.books
          tempArray.splice(index, 1)
          this.setData({
            books: tempArray
          })
        }
      }
    })
  },
  onQuery(event) {
    const db = wx.cloud.database()
    db.collection('recommend').where({
      recommend: 1
    }).get({
      success: res => {
        // const data = JSON.stringify(res.data, null, 2)
        this.setData({
          books: res.data[0].recommend_book
        })
      },
      fail: error => console.log(error)
    })
  },
  _requestRecommendBook(){
    const bookRecommendUrl = 'https://www.apiopen.top/novelApi'
    return http.request({
      url: bookRecommendUrl
    })
  },

  getRecommedBooks(){
    wx.cloud.callFunction({
      name:  'getRecommendBook',
      data: {
        url: 'https://www.apiopen.top/novelApi'
      }
    }).then(res => {
      console.log(res)
      const books = []
      res.result.data.forEach(item => {
        books.push({
          author: item.author_name,
          image: item.book_cover
        })
      })
      this.setData({
        books: books
      })
    })
  },
  searchBook(q){
    book.searchBook(q)
  },
  getBookDetail(q){
    book.getBookDetail(q)
  },
  onLoad: function(options) {
    this.getRecommedBooks()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.onQuery()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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