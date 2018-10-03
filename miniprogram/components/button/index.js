// components/button/index.js
Component({
  properties: {
    added: Boolean,
    read: Boolean
  },

  data: {
    readText:'立即阅读',
    addText: '添加到书架',
    addedText: '已添加',
    readingText: '继续阅读'
  },

  methods: {
    onAddBook(event) {
      if (this.properties.added) {
        return
      }
      this.setData({
        added: true
      })
      this.triggerEvent('onAddBook', {
        state: this.properties.added
      }, {})
    },
    
    onRead(event) {
      if (this.properties.read) {
        return
      }
      this.setData({
        read: true
      })
      this.triggerEvent('onRead', {
        state: this.properties.read
      }, {})
    }
  },
  attached(event) {
    // 在这个生命周期函数里部能拿到外部传来的属性
  }
})
