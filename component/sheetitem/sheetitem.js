// component/sheetitem/sheetitem.js
Component({

  properties: {
    page: Number,
    sheettype: Number
  },

  data: {

  },

  methods: {
    tapFile() {
      let pages = getCurrentPages();
      if (pages.length > 1) {
        let prePage = pages[pages.length - 2];
        prePage.$data.page = this.properties.page
        prePage.loadPage()
        wx.navigateBack()
      }
    }
  }
})
