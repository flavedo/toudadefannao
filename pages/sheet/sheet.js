// pages/sheet/sheet.js
const { getShareInfo, getBookName } = require('../../utils/util.js')
const app = getApp()

Page({

  data: {
    items: []
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
        let id = i
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
		      subject,
          id
		    })
        
		    if(row.length == 5 || i == subjectDatas.length - 1) {
			    items.push(Object.assign(row))
			    row = []
		    }
      }
      console.log(subjectDatas.length)
	    this.setData({
        items
      })
      wx.showLoading({
        title: '正在加载',
        icon: 'loading'
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
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

  tapBack: function() {
    wx.navigateBack()
  },
  
  onShareAppMessage: function () {
    app.aldstat.sendEvent("share")
    return getShareInfo()
  }
})