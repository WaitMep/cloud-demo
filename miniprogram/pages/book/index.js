import {BookModule} from '../../modules/book.js'
const book = new  BookModule()
Page({
  data: {
    searching: false,
    books: [],
    index: null,
    loaded: false
  },
  onVisitDetail(event) {
    wx.navigateTo({
      url: `../bookDetail/index`,
    })
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
      const books = []
      res.result.data.forEach(item => {
        books.push({
          author: item.author_name,
          image: item.book_cover
        })
      })
      this.setData({
        books: books,
        loaded: true
      })
      wx.hideLoading()
    })
  },
  searchBook(q){
    book.searchBook(q)
  },
  getBookDetail(q){
    book.getBookDetail(q)
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
    this.getRecommedBooks()
  }
})