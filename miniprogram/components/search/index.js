// components/search/index.js
import {
  BookModule
} from '../../modules/book.js'
const book = new BookModule()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    more: {
      type: String,
      observer: '_loadMore'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searched: false,
    books: [],
    hotSearch: [],
    historySearch: [],
    value: '',
    hasMore: true,
    loading: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onNavigateTo(event){
      this.triggerEvent('onNavigateTo', {
        bid: event.detail.bid
      }, {})
    },
    onDelete() {
      this._initData()
      this._showSearch()
      this._emptyInput()
      this._updataTag()
      wx.hideLoading()
    },
    onConfirm(event) {
      const q = event.detail.value || event.detail.content
      if (q == false || typeof q === 'undefined') {
        return
      }
      this._showResult()
      wx.showLoading({
        title: 'loading...',
      })
      this._getBookDetail(q)

    },
    onCancel(event) {
      this.triggerEvent('cancel', {}, {})
      wx.hideLoading()
    },
    /**
     * 组件私有方法
     */
    _limit(str){
      return str.length>=50?str.substr(0,50)+'...':str
    },
    _getBookDetail(q) {
      wx.cloud.callFunction({
        name: 'getBookDetail',
        data: {
          url: `https://www.apiopen.top/novelInfoApi?name=${encodeURIComponent(q)}`
        }
      }).then(res => {
        if(!res.result.data){
          wx.hideLoading()
          wx.showToast({
            title: '你确定你要搜这个？',
            icon: 'none'
          })
          return
        }
        let datas = res.result.data.data
        datas = datas?datas:[]
        let aladdin = res.result.data.aladdin
        aladdin = aladdin?[aladdin]:[]
      
        const books = this._format(aladdin).concat(this._format(datas))
        this.setData({
          books: books,
          value: q
        })
        this._setStorage(q)
        wx.hideLoading()
      }, err => {
        console.log(err, 'err')
        wx.hideLoading()
      })
    },
    _format(datas){
      const books = []
      for (let item of datas) {
        if(!item.author){
          return []
        }
        const book = { 
          image: item.cover,
          author: item.author,
          title: item.title,
          description: this._limit(item.desc),
          bid: item.bid
        }
        books.push(book)
      }
      return books || []
    },
    _lock() {
      this.data.loading = true
    },
    _unlock() {
      this.data.loading = false
    },
    _isLocking() {
      return this.data.loading
    },
    _loadMore() {
      if (this.data.searched && this.data.hasMore) {
        const length = this.data.books.length
        if (this._isLocking()) {
          return
        }

        wx.showLoading({
          title: 'loading...'
        })

        console.log('load more')
        this._lock()
        this._searchBook(this.data.value, 1, length).then(res => {
          // 结果是为空
          if (!res.data.books.length) {
            this.setData({
              hasMore: false
            })
            this._unlock()
            wx.hideLoading()
            return
          }

          // 结果不为空
          let tempArray = this.data.books
          tempArray = tempArray.concat(res.data.books)
          this.setData({
            books: tempArray
          })
          this._unlock()
          wx.hideLoading()
        }, error => {
          // 断网或出现错误时解锁
          this._unlock()
          wx.hideLoading()
        })
      }
    },
    _updataTag() {
      this.setData({
        historySearch: wx.getStorageSync('q')
      })
    },
    _setStorage(q) {
      const tempArray = wx.getStorageSync('q') || []
      if (!tempArray.includes(q)) {
        tempArray.push(q)
      }
      if (tempArray.length > 10) {
        tempArray.shift()
      }

      wx.setStorageSync('q', tempArray)
    },
    _showResult() {
      this.setData({
        searched: true
      })
    },
    _searchBook(q, summary = 0, start = 0) {
      return book.searchBook(q)
    },
    _initData() {
      this.setData({
        books: [],
        hasMore: true
      })
    },
    _showSearch() {
      this.setData({
        searched: false
      })
    },
    _emptyInput() {
      this.setData({
        value: ''
      })
    },
     _getHistory() {
      return wx.getStorageSync('q') || []
    }
  },
 
  attached() {
    this.setData({
      hotSearch: ['大主宰', '绝世唐门', '万古神帝', '盗墓笔记', '斗破苍穹', '天帝传'],
      historySearch: this._getHistory()
    })
  }
})