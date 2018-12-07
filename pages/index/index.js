const { getShareInfo } = require('../../utils/util.js')
const { addCollects } = require('../../utils/store.js')
const app = getApp()

Page({
  data: {
    books:[
      {
        key: 1,
        image: "history-book",
        name: "近代史纲要",
        bookType: "history"
      },
      {
        key: 2,
        image: "law-book",
        name: "法律基础",
        bookType: "law"
      },
      {
        key: 3,
        image: "mao-book",
        name: "毛泽东思想",
        bookType: "mao"
      },
      {
        key: 4,
        image: "marx-book",
        name: "马克思主义",
        bookType: "marx"
      },
      {
        key: 5,
        image: "moral-book",
        name: "思想道德",
        bookType: "moral"
      },
    ]
  },

  onLoad() {
    app.login()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#166888'
    })
  },

  tapbook: function(e) {
    console.log("click: " + e.currentTarget.dataset.book)
    let bookType = e.currentTarget.dataset.book
    //this.test(bookType)
    if (this.existOldCollects(bookType)) {
      let self = this
      wx.showModal({
        title: '',
        showCancel: false,
        content: '检测到本地存在收藏题目，将转移至云盘，再也不怕丢失了',
        success: function (res) {
          self.tranferCollects(bookType)
        }
      })
    } else {
      wx.navigateTo({
        url: "../../pages/type/type?bookType=" + bookType
      })
      app.aldstat.sendEvent("index_book", {
        type: bookType
      })
    }
  },

  onShareAppMessage: function () {
	  app.aldstat.sendEvent("index_share")
    return getShareInfo()
  },

  existOldCollects(bookType) {
    let collects = wx.getStorageSync(bookType + "-collect");
    return collects && collects.length > 0
  },

  tranferCollects(bookType) {
    wx.showLoading({ title: '正在迁移'})
    let subjects = wx.getStorageSync(bookType + "-collect");
    console.log(subjects, app.getUserid())
    addCollects(bookType, subjects, app.getUserid()).then((res) => {
      console.log(res)
      wx.removeStorageSync(bookType + "-collect")
      wx.hideLoading()
      wx.showToast({
        title: '迁移完成'
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '迁移失败'
      })
    })
  },

  test(bookType) {
    let questionNum = 1
    let questionType = 'multi'
    let subjects = []
    subjects.push({
      bookType,
      questionNum,
      questionType
    })
    wx.setStorageSync(bookType + "-collect", subjects)
  }
})