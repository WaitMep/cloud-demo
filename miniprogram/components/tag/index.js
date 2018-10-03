// components/tag/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:String
  },
  options: {
    multipleSlots: true
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
    onTap(event) {
      this.triggerEvent('onTap', {
        content: this.properties.content
      }, {})
    }
  }
})
