const { getShareInfo, sendFeedback, sendEvent } = require('../../utils/util.js')
const app = getApp()

Page({

  data: {
    content : '',
    contact : '',
    contentTip: '请输入反馈内容',
    contactTip: '邮件或QQ(选填)'
  },

  $data: {
    mobileInfo : '',
    screenInfo : '',
    wechatVersion : '',
    appVersion: ''
  },

  onLoad: function (options) {
    app.login()
  },

  submitForm: function (e) {
    var content = e.detail.value.content;
    var contact = e.detail.value.contact;
    var userInfo = app.getUserInfo()
    var userid = app.getUserid()
    //先进行表单非空验证
    if (content.length == 0) {
      wx.showToast({
        title: '反馈内容不能为空',
        icon: 'none',
        duration: 800
      })
    } else {
      wx.showLoading({
        title: '正在反馈',
      })
      sendFeedback(content, contact, userid, userInfo.nickName, userInfo.gender).then(() =>{
        this.setData({
          content: '',
          contact: '',
        })
        wx.hideLoading()
        wx.showToast({
          title: '反馈成功！谢谢你的意见和建议',
          icon: 'none'
        })
        app.aldstat.sendEvent("feedback_success")
      }).catch((err) =>{
        wx.hideLoading()
        wx.showToast({
          title: '不好意思，反馈失败了！',
          icon: 'none'
        })
        app.aldstat.sendEvent("feedback_failed")
      })
    }
  },

  onShareAppMessage: function () {
    app.aldstat.sendEvent("feedback_share")
    return getShareInfo()
  }
})