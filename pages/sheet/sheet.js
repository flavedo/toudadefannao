// pages/sheet/sheet.js
const { getShareInfo, getBookName } = require('../../utils/util.js')
const app = getApp()

Page({

  data: {
    subjectsList: [],
    optionsList: [],
    currentIndex: 0
  },

  onLoad: function (options) {
    console.log(options)
    let { bookType } = this.options
    this.showTitle(bookType)
    this.getSubjectData()
  },
  
  showTitle: function (bookType) {
    wx.setNavigationBarTitle({
      title: getBookName(bookType)
    })
  },

  getSubjectData: function() {
    let pages = getCurrentPages();
    if (pages.length > 1) {
      let prePage = pages[pages.length - 2];
      let subjectDatas = prePage.$data.subjectDatas
      let userOptions = prePage.$data.userOptions
      let currentIndex = parseInt(prePage.$data.page / 100)
      let scrollTop = currentIndex * 100
      let subjectsList = []
      let optionsList = []
      for (var i = 0, len = subjectDatas.length; i < len; i += 100) {
        subjectsList.push(subjectDatas.slice(i, i + 100))
        optionsList.push(userOptions.slice(i, i + 100))
      }

      this.setData({
        subjectsList,
        optionsList,
        currentIndex
      })
    }
  },

  tapBack: function() {
    wx.navigateBack()
  },
  
  onShareAppMessage: function () {
    app.aldstat.sendEvent("share")
    return getShareInfo()
  }
})