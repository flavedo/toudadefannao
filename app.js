//app.js

var Bmob = require('./utils/Bmob-1.6.6.min.js')
var aldstat = require("./utils/ald-stat.js")

App({

  globalData: {
    userInfo: null,
    userid: null,
  },

  onLaunch: function () {
    this.initConfig()
    this.initStorage()
  },

  initConfig() {
    Bmob.initialize("bd208b81b332e05393e609a458e53b54", "368ee04c5a305e62f84cc592168c9bcd")
  },

  initStorage() {
    this.globalData.userInfo = wx.getStorageSync("userInfo")
    this.globalData.userid = wx.getStorageSync("userid")
    console.log(this.globalData)
  },

  isLogin() {
    let { userid, userInfo } = this.globalData
    if (userid && userInfo) {
      return true
    }
    return false
  },

  login() {
    let { userid, userInfo } = this.globalData
    if (userid && userInfo) {
      return true
    }

    let self = this
    wx.getUserInfo({
      success: function (res) {
        self.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', self.globalData.userInfo)
        self.getUserid()
      },
      fail: function (res) {
        self.gotoAuthorize()        
      }
    })
    return false
  },

  getUserid() {
    Bmob.User.auth().then(res => {
      this.globalData.userid = res.objectId
      this.globalData.sessionToken = res.sessionToken
      wx.setStorageSync('userid', this.globalData.userid)
      this.gotoHomePage()
    }).catch(err => {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '登录失败，请重试',
      })
    })
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
  },

  getUserid() {
    return this.globalData.userid
  }
})