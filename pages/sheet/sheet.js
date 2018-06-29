// pages/sheet/sheet.js
const { getShareInfo, getBookName } = require('../../utils/util.js')
const app = getApp()

Page({

  data: {
	items: [] // 二维数组
  },

  $data: {
    bookType: ''
  },

  onLoad: function (options) {
    this.$data.bookType = options.bookType
    this.setBookName()
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      var subjectDatas = prePage.$data.subjectDatas
      var userOptions = prePage.$data.userOptions
	  
	  var items = []
	  var row = []
      for (var i = 0; i < subjectDatas.length; i++) {
		
		let sheetType
		let subject = subjectDatas[i]
        if (typeof(userOptions[i]) == 'undefined') {
          sheetType = 1
        } else {
		  if (userOptions[i].sort().toString() == subjectDatas[i].answer.sort().toString()) {
            sheetType = 2
          } else {
            sheetType = 3
          }
        }
		
		row.push({
			sheetType,
			subject
		})
		
		if(row.length == 5 && i == subjectDatas.length - 1) {
			items.push(Object.assign(row))
			row = []
		}
      }
	  
	  this.setData({
        items
      })
    }
  },
  
  setBookName: function () {
    wx.setNavigationBarTitle({
      title: getBookName(this.$data.bookType)
    })
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
    app.aldstat.sendEvent("share")
    return getShareInfo()
  }
})