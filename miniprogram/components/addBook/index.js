// components/addBook/index.js
Component({
  properties: {

  },
  data: {

  },
  methods: {
    addBook(event) {
      console.log('add book')
      this.triggerEvent('addBook', {}, {})
    }
  }
})
