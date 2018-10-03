// components/book/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: Number,
    book: Object,
    imageOnly: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLongTap(event) {
      this.triggerEvent('longTap', {
        index: this.properties.index
      }, {})
    }
  }
})
