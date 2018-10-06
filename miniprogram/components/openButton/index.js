// components/openButton/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openType:{
      type: String
    },
    plain:{
      type: Boolean
    }
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
    onGetuserinfo(event){
      this.triggerEvent('getuserinfo', event.detail, {})
    }
  }
})
