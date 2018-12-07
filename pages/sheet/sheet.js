// pages/sheet/sheet.js
const { getShareInfo, getBookName } = require('../../utils/util.js')
const { getSubjectDatas, getUserOptions } = require('../../utils/store.js')
const app = getApp()

Page({

  data: {
    subjectsList: [],
    optionsList: [],
    currentIndex: 0
  },

  onLoad: function (options) {
    app.login()
    let { bookType, subjectType } = this.options
    this.showTitle(bookType)
    this.getSubjectData()
  },
  
  showTitle: function (bookType) {
    wx.setNavigationBarTitle({
      title: getBookName(bookType)
    })
  },

  getSubjectData: function() {
    let { bookType, subjectType, page } = this.options
    getSubjectDatas(bookType, subjectType, app.getUserid()).then(subjects => {
      let currentIndex = parseInt(page / 100)
      let userOptions = []
      for (let i in subjects) {
        userOptions.push(getUserOptions(bookType, subjectType, i))
      }
      
      let subjectsList = []
      let optionsList = []
      for (var i = 0, len = subjects.length; i < len; i += 100) {
        subjectsList.push(subjects.slice(i, i + 100))
        optionsList.push(userOptions.slice(i, i + 100))
      }

      this.setData({
        subjectsList,
        optionsList,
        currentIndex
      })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        title: '加载出错'
      })
    })
  },

  tapBack: function() {
    wx.navigateBack()
    app.aldstat.sendEvent("sheet_back")
  },
  
  onShareAppMessage: function () {
    app.aldstat.sendEvent("sheet_share")
    return getShareInfo()
  },
})