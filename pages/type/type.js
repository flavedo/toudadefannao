// pages/type/type.js
const { getBookName, getShareInfo } = require('../../utils/util.js')
const app = getApp()

Page({

  data: {
    bookType: ''
  },

  onLoad: function (options) {
    this.setData({
      bookType: options.bookType
    })
    this.setBookName()
  },

  setBookName: function () {
    wx.setNavigationBarTitle({
      title: getBookName(this.data.bookType)
    })
  },

  //all、single、multi、judge
  tapAll: function () {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=all"
    })
    app.aldstat.sendEvent("type", {
      bookType: this.data.bookType,
      subjectType: 'all'
    })
  },

  tapSingle: function () {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=single"
    })
    app.aldstat.sendEvent("type", {
      bookType: this.data.bookType,
      subjectType: 'single'
    })
  },

  tapMulti: function () {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=multi"
    })
    app.aldstat.sendEvent("type", {
      bookType: this.data.bookType,
      subjectType: 'multi'
    })
  },

  tapJudge: function () {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=judge"
    })
    app.aldstat.sendEvent("type", {
      bookType: this.data.bookType,
      subjectType: 'judge'
    })
  },

  tapCollect: function() {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=collect"
    })
    app.aldstat.sendEvent("type", {
      bookType: this.data.bookType,
      subjectType: 'collect'
    })
  },

  onShareAppMessage: function () {
    app.aldstat.sendEvent("type_share")
    return getShareInfo()
  },
})