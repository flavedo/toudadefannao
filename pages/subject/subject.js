// pages/subject/subject.js

const { loadTypeBook, getBookName, storeSubjectDone, getSubjectDone, getShareInfo } = require('../../utils/util.js')
const app = getApp()
var touchDot = 0 // 触摸时的原点
var time = 0 // 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = '' // 记录/清理 时间记录
var switchInterval = '' // 记录/清理 切页记录

Page({

  data: {
    isDatiModel: true,
    subject: {},
    rank: 1,
    num: 1,
    rankcount: 1,
    rightAnswerTip: false,
    wrongAnswerTip: false,
    showCommitBtn: false,
    userAnswer: '',
    rightAnswer: '',
  },

  $data: {
    bookType: '',
    subjectType: '', // all、single、multi、judge、collect、wrong	
    subjectDatas: [],
    userOptions: [],
    page: 0,
    hasCheckHistory: false
  },

  onLoad: function (options) {
    this.$data.bookType = options.bookType
    this.$data.subjectType = options.subjectType
    this.setBookName()
    this.checkBookData()
  },

  setBookName: function () {
    wx.setNavigationBarTitle({
      title: getBookName(this.$data.bookType)
    })
  },

  checkBookData: function () {
    if (this.$data.subjectDatas && this.$data.subjectDatas.length > 0) {
      this.loadPage()
    } else {
      wx.showLoading({ title: '正在加载' })
      loadTypeBook(this.$data.bookType, this.$data.subjectType).then(subjects => {
        this.$data.subjectDatas = subjects
        wx.hideLoading()
        this.loadPage()
      }).catch(code => {
        wx.hideLoading()
        wx.showToast({ title: '加载错误' })
      })
    }
  },

  loadPage: function () {
    let bookData = this.$data.subjectDatas
    if (this.$data.page >= 0 && this.$data.page < bookData.length) {
      let rank = parseInt(this.$data.page / 100) + 1
      let subject = bookData[this.$data.page]
      let num = this.$data.page % 100 + 1
      let rankcount = this.$data.page <= (parseInt(bookData.length / 100) * 100) ? 100 : (bookData.length % 100)
      this.setData({
        subject,
        rank,
        num,
        rankcount,
        rightAnswerTip: false,
        wrongAnswerTip: false,
        userAnswer: '',
        rightAnswer: '',
        showCommitBtn: false
      })
      
      if (this.data.isDatiModel) {
        this.showDatiModel()
      } else {
        this.showBetiModel()
      }
      this.checkHistorySubject()
    }
  },

  checkHistorySubject: function () {
    if (this.$data.hasCheckHistory) {
      return
    }
    this.$data.hasCheckHistory = true
    let storePage = getSubjectDone(this.$data.bookType, this.$data.subjectType)
    let that = this
    console.log(storePage)
    if (!isNaN(storePage) && storePage != that.$data.page) {
      wx.showModal({
        content: '是否回到上次做题的位置',
        success: function (res) {
          if (res.confirm) {
            that.$data.page = storePage
            that.loadPage()
          } else {
            storeSubjectDone(that.$data.bookType, that.$data.subjectType, that.$data.page)
          }
        }
      })
    }
  },

  onShareAppMessage: function () {
	app.aldstat.sendEvent("share")
    return getShareInfo()
  },

  tapOptionA: function () {
    let optionA = this.selectComponent("#optionA");
    let userOption = this.$data.userOptions[this.$data.page]
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([0])
      } else {
        if (optionA.isShow()) {
          optionA.selectOption()
        } else if (optionA.isSelect()) {
          optionA.showOption()
        }
      }
    }
  },

  tapOptionB: function () {
    let optionB = this.selectComponent("#optionB");
    let userOption = this.$data.userOptions[this.$data.page]
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([1])
      } else {
        if (optionB.isShow()) {
          optionB.selectOption()
        } else if (optionB.isSelect()) {
          optionB.showOption()
        }
      }
    }
  },

  tapOptionC: function () {
    let optionC = this.selectComponent("#optionC");
    let userOption = this.$data.userOptions[this.$data.page]
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([2])
      } else {
        if (optionC.isShow()) {
          optionC.selectOption()
        } else if (optionC.isSelect()) {
          optionC.showOption()
        }
      }
    }
  },

  tapOptionD: function () {
    let optionD = this.selectComponent("#optionD");
    let userOption = this.$data.userOptions[this.$data.page]
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([3])
      } else {
        if (optionD.isShow()) {
          optionD.selectOption()
        } else if (optionD.isSelect()) {
          optionD.showOption()
        }
      }
    }
  },

  tapDati: function () {
    if (!this.data.isDatiModel) {
      this.setData({ isDatiModel: true })
      this.showDatiModel()
    }
	app.aldstat.sendEvent("dati")
  },

  tapBeiti: function () {
    if (this.data.isDatiModel) {
      this.setData({ isDatiModel: false })
      this.showBetiModel()
    }
	app.aldstat.sendEvent("beiti")
  },

  tapCommit: function () {
    let result = []
    let optionA = this.selectComponent("#optionA");
    let optionB = this.selectComponent("#optionB");
    let optionC = this.selectComponent("#optionC");
    let optionD = this.selectComponent("#optionD");
    if (optionA != null && optionA.isSelect()) {
      result.push(0)
    }
    if (optionB != null && optionB.isSelect()) {
      result.push(1)
    }
    if (optionC != null && optionC.isSelect()) {
      result.push(2)
    }
    if (optionD != null && optionD.isSelect()) {
      result.push(3)
    }
    this.commitResult(result)
  },

  commitResult: function (userOption) {
    console.log("userOption:" + userOption)
    wx.vibrateShort()
    if (userOption.length == 0) {
      wx.showToast({
        title: '至少选择一个选项',
        icon: 'none'
      })
      return
    }
    this.setData({ showCommitBtn: false })
    storeSubjectDone(this.$data.bookType, this.$data.subjectType, this.$data.page)
    this.$data.userOptions[this.$data.page] = userOption
    this.showComfirmResult(userOption)
    if (userOption.sort().toString() == this.data.subject.answer.sort().toString()) {
      this.startAutoSwitchPage()
    }
  },

  showComfirmResult: function (userOption) {
    let answer = this.data.subject.answer
    let userAnswer = ''
    let rightAnswer = ''

    let optionA = this.selectComponent("#optionA");
    let existInAnswer = (answer.indexOf(0) != -1)
    let existInUserOption = (userOption.indexOf(0) != -1)
    if (existInAnswer && existInUserOption) {
      optionA.rightResultOption()
      rightAnswer += 'A '
      userAnswer += 'A '
    } else if (existInAnswer) {
      optionA.rightOption()
      rightAnswer += 'A '
    } else if (existInUserOption) {
      optionA.wrongResultOption()
      userAnswer += 'A '
    } else if (optionA != null) {
      optionA.showOption()
    }

    let optionB = this.selectComponent("#optionB");
    existInAnswer = (answer.indexOf(1) != -1)
    existInUserOption = (userOption.indexOf(1) != -1)
    if (existInAnswer && existInUserOption) {
      optionB.rightResultOption()
      rightAnswer += 'B '
      userAnswer += 'B '
    } else if (existInAnswer) {
      optionB.rightOption()
      rightAnswer += 'B '
    } else if (existInUserOption) {
      optionB.wrongResultOption()
      userAnswer += 'B '
    } else if (optionB != null) {
      optionB.showOption()
    }

    let optionC = this.selectComponent("#optionC");
    existInAnswer = (answer.indexOf(2) != -1)
    existInUserOption = (userOption.indexOf(2) != -1)
    if (existInAnswer && existInUserOption) {
      optionC.rightResultOption()
      rightAnswer += 'C '
      userAnswer += 'C '
    } else if (existInAnswer) {
      optionC.rightOption()
      rightAnswer += 'C '
    } else if (existInUserOption) {
      optionC.wrongResultOption()
      userAnswer += 'C '
    } else if (optionC != null) {
      optionC.showOption()
    }

    let optionD = this.selectComponent("#optionD");
    existInAnswer = (answer.indexOf(3) != -1)
    existInUserOption = (userOption.indexOf(3) != -1)
    if (existInAnswer && existInUserOption) {
      optionD.rightResultOption()
      rightAnswer += 'D '
      userAnswer += 'D '
    } else if (existInAnswer) {
      optionD.rightOption()
      rightAnswer += 'D '
    } else if (existInUserOption) {
      optionD.wrongResultOption()
      userAnswer += 'D '
    } else if (optionD != null) {
      optionD.showOption()
    }

    let rightAnswerTip = userOption.sort().toString() == answer.sort().toString()
    let wrongAnswerTip = !rightAnswerTip
    this.setData({
      rightAnswerTip,
      wrongAnswerTip,
      userAnswer,
      rightAnswer
    })
  },

  startAutoSwitchPage: function () {
    let page = this.$data.page + 1
    let bookData = this.$data.subjectDatas
    let that = this
    if (page < bookData.length) {
      switchInterval = setInterval(function () {
        that.$data.page = page
        that.loadPage()
        clearInterval(switchInterval)
      }, 500)
    }
  },

  showDatiModel: function () {
    let userOption = this.$data.userOptions[this.$data.page]

    if (typeof (userOption) != "undefined") {
      // 已经答过题
      this.showComfirmResult(userOption)
    } else {
      this.recoverOptions()
      if (this.data.subject.questionType == 3) {
        this.setData({ showCommitBtn: true })
      }
    }

  },

  showBetiModel: function () {
    let answer = this.data.subject.answer
    let optionA = this.selectComponent("#optionA");
    if (answer.indexOf(0) != -1) {
      optionA.rightOption()
    } else if (optionA != null) {
      optionA.showOption()
    }
    let optionB = this.selectComponent("#optionB");
    if (answer.indexOf(1) != -1) {
      optionB.rightOption()
    } else if (optionB != null) {
      optionB.showOption()
    }
    let optionC = this.selectComponent("#optionC");
    if (answer.indexOf(2) != -1) {
      optionC.rightOption()
    } else if (optionC != null) {
      optionC.showOption()
    }
    let optionD = this.selectComponent("#optionD");
    if (answer.indexOf(3) != -1) {
      optionD.rightOption()
    } else if (optionD != null) {
      optionD.showOption()
    }
    this.setData({ showCommitBtn: false })
  },


  recoverOptions: function () {
    let optionA = this.selectComponent("#optionA");
    if (optionA != null) { optionA.showOption() }
    let optionB = this.selectComponent("#optionB");
    if (optionB != null) { optionB.showOption() }
    let optionC = this.selectComponent("#optionC");
    if (optionC != null) { optionC.showOption() }
    let optionD = this.selectComponent("#optionD");
    if (optionD != null) { optionD.showOption() }
  },

  tapCollect: function() {
    wx.showToast({
      title: '这个功能还未开发完成！',
      icon: 'none',
      duration: 800
    })
	  app.aldstat.sendEvent("collect")
  },

  tapSheet: function() {
    wx.showToast({
      title: '这个功能还未开发完成！',
      icon: 'none',
      duration: 800
    })
	  app.aldstat.sendEvent("sheet")
  },

  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用 js 计时器记录时间 
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  touchEnd: function (e) {
    var that = this;
    var touchMove = e.changedTouches[0].pageX;
    var moveIndex = e.currentTarget.dataset.tab;
    // 向左滑动 
    if (touchMove - touchDot <= -40 && time < 10) {
      console.log('左边')
      let page = this.$data.page + 1
      let bookData = this.$data.subjectDatas
      if (page < bookData.length) {
        this.$data.page = page
        this.loadPage()
      } else {
        wx.showToast({
          title: '没有了更多！',
          icon: 'none',
          duration: 500
        })
      }
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      console.log('右边')
      let page = this.$data.page - 1
      if (page >= 0) {
        this.$data.page = page
        this.loadPage()
      } else {
        wx.showToast({
          title: '没有了更多！',
          icon: 'none',
          duration: 500
        })
      }
    }

    clearInterval(interval); // 清除 setInterval
    time = 0;
  }
})