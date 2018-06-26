
Page({
  data: {
    books:[
      {
        key: 1,
        image: "history-book",
        name: "近代史纲要",
        bookType: "history"
      },
      {
        key: 2,
        image: "law-book",
        name: "法律基础",
        bookType: "law"
      },
      {
        key: 3,
        image: "mao-book",
        name: "毛泽东思想",
        bookType: "mao"
      },
      {
        key: 4,
        image: "marx-book",
        name: "马克思主义",
        bookType: "marx"
      },
      {
        key: 5,
        image: "moral-book",
        name: "思想道德",
        bookType: "moral"
      },
    ]
  },

  tapbook: function(e) {
    console.log(e.currentTarget.dataset.book)
    let bookType = e.currentTarget.dataset.book
    wx.navigateTo({
      url: "../../pages/subject/subject?book=" + bookType
    })
  },

  onShareAppMessage: function () {

  }
})