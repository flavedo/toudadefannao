// component/sheetitem/sheetitem.js
Component({

  properties: {
    subject: Object,
    option: Object,
    num: Number
  },

  data: {
    sheettype: 1
  },

  methods: {
    tapFile() {
      let { subject, option } = this.properties
      wx.vibrateShort()
      let pages = getCurrentPages();
      if (pages.length > 1 && subject) {
        let prePage = pages[pages.length - 2];
        prePage.$data.page = this.properties.num
        prePage.loadPage()
        wx.navigateBack()
      }
    }
  }
})
