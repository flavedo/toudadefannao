// component/sheetitem/sheetitem.js
Component({

  properties: {
    page: Number,
    sheettype: Number,
    num: Number
  },

  data: {

  },

  methods: {
    tapFile() {
      wx.vibrateShort()
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
