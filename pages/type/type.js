// pages/type/type.js
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
    return {
      title: '头大的烦恼',
      path: '/pages/index/index',
      desc: '社科刷题小程序',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})