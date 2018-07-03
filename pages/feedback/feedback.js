const { getShareInfo, sendFeedback, sendEvent } = require('../../utils/util.js')
const app = getApp()

Page({

  data: {
    content : '',
    contact : '',
    isLoading: false,
    isdisabled: false
  },

  $data: {
    mobileInfo : '',
    screenInfo : '',
    wechatVersion : '',
    appVersion: ''
  },

  onLoad: function (options) {
    app.aldstat.sendEvent("feeback")
  },

  submitForm: function (e) {
    var content = e.detail.value.content;
    var contact = e.detail.value.contact;
    //先进行表单非空验证
    if (content.length == 0) {
      wx.showToast({
        title: '反馈内容不能为空',
        icon: 'none',
        duration: 800
      })
    } else {
      this.setData({
        isLoading: true,
        isdisabled: true
      })
      sendFeedback(content, contact).then(() =>{
        wx.showToast({
          title: '反馈成功！谢谢你的意见和建议',
          icon: 'none'
        })
        this.setData({
          isLoading: false,
          isdisabled: false,
          content: '',
          contact: '',
        })
        app.aldstat.sendEvent("feebackSuccess")
      }).catch(() =>{
        wx.showToast({
          title: '不好意思，反馈失败了！',
          icon: 'none'
        })
        this.setData({
          isLoading: false,
          isdisabled: false
        })
        app.aldstat.sendEvent("feebackFailed")
      })
    }
  },

  onShareAppMessage: function () {
    app.aldstat.sendEvent("share")
    return getShareInfo()
  }
})