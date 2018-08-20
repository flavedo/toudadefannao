//app.js

var Bmob = require('./utils/Bmob-1.6.1.min.js')
var aldstat = require("./utils/ald-stat.js")

App({
  onLaunch: function () {
    // 展示本地存储能力
    Bmob.initialize("bd208b81b332e05393e609a458e53b54", "368ee04c5a305e62f84cc592168c9bcd")
    wx.login({
      success: res => {}
    })
    
  },
  globalData: {
    userInfo: null
  }
})