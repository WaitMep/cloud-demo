// components/description/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book: Object
  },

  data: {

  },

  methods: {
    onTap(event) {
      this.triggerEvent('onTap', {
        bid: this.properties.book.bid
      }, {})
    }
  }
})
