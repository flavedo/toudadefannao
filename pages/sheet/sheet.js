// pages/sheet/sheet.js
const { getShareInfo } = require('../../utils/util.js')
const app = getApp()

Page({

  data: {
  
  },

  $data: {

  },

  onLoad: function (options) {
  
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

  onShareAppMessage: function () {
    app.aldstat.sendEvent("share")
    return getShareInfo()
  }
})