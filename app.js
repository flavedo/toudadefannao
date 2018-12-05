//app.js

var Bmob = require('./utils/Bmob-1.6.1.min.js')
var aldstat = require("./utils/ald-stat.js")

App({

  globalData: {
    userInfo: null
  },

  onLaunch: function () {
    Bmob.initialize("bd208b81b332e05393e609a458e53b54", "368ee04c5a305e62f84cc592168c9bcd")
  },

  isLogin() {
    if (this.globalData.userInfo) {
      return true
    }
    return false
  },

  login() {
    if (this.globalData.userInfo) {
      return true
    }
    let self = this
    wx.getUserInfo({
      success: function (res) {
        self.globalData.userInfo = res.userInfo
        self.gotoHomePage()
      },
      fail: function (res) {
        self.gotoAuthorize()        
      }
    })
    return false
  },

  gotoHomePage() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  gotoAuthorize() {
    wx.redirectTo({
      url: '/pages/authorize/authorize'
    })
  }
})