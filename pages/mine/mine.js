const app = getApp()
const { getShareInfo, getAutoPage, setAutoPage, getLastNextBtn, setLastNextBtn } = require('../../utils/util.js')

Page({
  data: {
    isAutoPage: true,
    isLastNextBtn: true,
    avatarUrl: '',
    nickName: ''
  },

  onShow: function () {
    if (app.login()) {
      let avatarUrl = app.globalData.userInfo.avatarUrl
      let nickName = app.globalData.userInfo.nickName
      let isAutoPage = getAutoPage()
      let isLastNextBtn = getLastNextBtn()
      this.setData({
        isAutoPage,
        isLastNextBtn,
        avatarUrl,
        nickName
      })
    }
  },

  tapSwitch: function() {
    let isAutoPage = !this.data.isAutoPage
    setAutoPage(isAutoPage)
    this.setData({
      isAutoPage
    })
    app.aldstat.sendEvent("mine_auto_page")
  },

  tapLastNext: function() {
    let isLastNextBtn = !this.data.isLastNextBtn
    setLastNextBtn(isLastNextBtn)
    this.setData({
      isLastNextBtn
    })
    app.aldstat.sendEvent("mine_last_next")
  },

  tapFeedback: function() {
    wx.navigateTo({
      url: "../../pages/feedback/feedback"
    })
    app.aldstat.sendEvent("mine_feedback")
  },

  onShareAppMessage: function () {
	  app.aldstat.sendEvent("mine_share")
    return getShareInfo()
  },
})