const app = getApp()

Page({
  
  data: {

  },

  onLoad: function (options) {

  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: '授权',
    })
  },

  getUserInfo(res) {
    if (res) {
      app.login()
      app.aldstat.sendEvent("authorize_click")
    }
  }
})