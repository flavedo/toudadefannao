// pages/type/type.js
const { getShareInfo } = require('../../utils/util.js')

Page({
  
  data: {
    bookType:''
  },

  onLoad: function (options) {
    this.data.bookType = options.bookType
  },

  //all、single、multi、judge
  tapAll: function() {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=all"
    })
  },

  tapSingle: function(){
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=single"
    })
  },

  tapMulti: function() {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=multi"
    })
  },

  tapJudge: function() {
    wx.navigateTo({
      url: "../../pages/subject/subject?bookType=" + this.data.bookType + "&subjectType=judge"
    })
  },

  onShareAppMessage: function () {
    return getShareInfo()
  },
})