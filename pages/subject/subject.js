// pages/subject/subject.js

const { loadBook, getBookName } = require('../../utils/util.js')
const app = getApp()
var touchDot = 0 // 触摸时的原点
var time = 0 // 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "" // 记录/清理 时间记录

Page({

  data: {
    bookName: "",
    subject: {}
  },

  $data: {
    bookType: "",
    page: 0,
    isDatiModel: true,
  },

  onLoad: function (options) {
    this.$data.bookType = options.bookType
    this.setBookName()
    this.checkBookData()
  },

  setBookName: function () {
    this.setData({
      bookName: getBookName(this.$data.bookType)
    })
  },

  checkBookData: function () {
    if (app.globalData.bookData[this.$data.bookType]) {
      this.loadPage()
    } else {
      wx.showLoading({ title: '正在加载' })
      loadBook(this.$data.bookType).then(subjects => {
        app.globalData.bookData[this.$data.bookType] = subjects
        wx.hideLoading()
        this.loadPage()
      }).catch(code => {
        wx.hideLoading()
        wx.showToast({ title: '加载错误' })
      })
    }
  },

  loadPage: function () {
    let bookData = app.globalData.bookData[this.$data.bookType]
    if (this.$data.page >= 0 && this.$data.page < bookData.length) {
      this.setData({
        subject: bookData[this.$data.page]
      })
    }
  },

  onShareAppMessage: function () {

  },

  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用 js 计时器记录时间 
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  touchEnd: function (e) {
    var that = this;
    var touchMove = e.changedTouches[0].pageX;
    var moveIndex = e.currentTarget.dataset.tab;
    // 向左滑动 
    if (touchMove - touchDot <= -40 && time < 10) {
      let page = this.$data.page + 1
      let bookData = app.globalData.bookData[this.$data.bookType]
      if(page < bookData.length) {
        this.$data.page = page
        this.loadPage()
      } else {
        wx.showToast({
          title: '没有了更多！',
          icon: 'none',
          duration: 300
        })
      }
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      let page = this.$data.page - 1
      if (page >= 0) {
        this.$data.page = page
        this.loadPage()
      } else {
        wx.showToast({
          title: '没有了更多！', 
          icon: 'none',
          duration: 300
        })
      }
    }

    clearInterval(interval); // 清除 setInterval
    time = 0;
  }
})