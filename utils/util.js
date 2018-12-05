const { historyBookData } = require('../lib/data/history.js')
const { lawBookData } = require('../lib/data/law.js')
const { maoBookData } = require('../lib/data/mao.js')
const { marxBookData } = require('../lib/data/marx.js')
const { moralBookData } = require('../lib/data/moral.js')
var Bmob = require('../utils/Bmob-1.6.1.min.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const subjectComp = function (a, b) {
  let val1 = parseInt(a.questionNum);
  let val2 = parseInt(b.questionNum);
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}

const saveCollect = (bookType, collectDatas) => new Promise((resolve, reject) => {
  wx.setStorage({
    key: bookType + '-collect',
    data: collectDatas,
    success: function () {
      resolve()
    },
    fail: function (res) {
      reject(res)
    }
  })
})

const loadCollect = (bookType) => new Promise((resolve, reject) => {
  wx.getStorage({
    key: bookType + '-collect',
    success: function (res) {
      resolve(res.data)
    },
    fail: function (res) {
      console.log('fail')
      resolve([])
    }
  })
})

const loadBook = (bookType) => new Promise((resolve, reject) => {
  try {
    console.log("loadbook:" + bookType)
    let subjects
    switch (bookType) {
      case 'marx':
        subjects = marxBookData().sort(subjectComp)
        resolve(subjects)
        break
      case 'law':
        subjects = lawBookData().sort(subjectComp)
        resolve(subjects)
        break
      case 'history':
        subjects = historyBookData().sort(subjectComp)
        resolve(subjects)
        break
      case 'mao':
        subjects = maoBookData().sort(subjectComp)
        resolve(subjects)
        break
      case 'moral':
        subjects = moralBookData().sort(subjectComp)
        resolve(subjects)
        break
      default:
        reject()
        break;
    }
  } catch (e) {
    console.log('error')
    reject(e)
  }
})

// all、single、multi、judge、collect
const loadTypeBook = (bookType, subjectType) => new Promise((resolve, reject) => {
  console.log(subjectType)

  switch (subjectType) {
    case 'all':
      loadBook(bookType).then(subjects => {
        resolve(subjects)
      }).catch(e => {
        reject(e)
      })
      break
    case 'single':
      loadBook(bookType).then(subjects => {
        resolve(subjects.filter(item => {
          return item.questionType == 1
        }))
      }).catch(e => {
        reject(e)
      })
      break
    case 'judge':
      loadBook(bookType).then(subjects => {
        resolve(subjects.filter(item => {
          return item.questionType == 2
        }))
      }).catch(e => {
        reject(e)
      })
      break
    case 'multi':
      loadBook(bookType).then(subjects => {
        resolve(subjects.filter(item => {
          return item.questionType == 3
        }))
      }).catch(e => {
        reject(e)
      })
      break
    case 'collect':
      return loadCollect(bookType).then(subjects => {
        resolve(subjects)
      }).catch(e => {
        reject(e)
      })
    default:
      reject('未知题目类型')
      break
  }
})

const storeSubjectDone = (bookType, subjectType, page) => {
  try {
    wx.setStorageSync(bookType + '-' + subjectType, page)
  } catch (e) {
    console.log(e)
  }
}

const getSubjectDone = (bookType, subjectType) => {
  return parseInt(wx.getStorageSync(bookType + '-' + subjectType))
}

const getBookName = book => {
  switch (book) {
    case 'marx':
      return '马克思主义'
    case 'law':
      return '法律基础'
    case 'history':
      return '近代史纲要'
    case 'mao':
      return '毛泽东思想'
    case 'moral':
      return '道德基础'
    case 'collect':
      return '收藏题目'
    default:
      return ''
  }
}

const getShareInfo = () => {
  let shareInfo = [
    "来看看这道题为什么选这个?",
    "快来使用头大的社科小程序",
    "头大的烦恼值得信赖",
    "有什么意见尽管提",
	"skr skr"
  ]
  let randomNum = Math.floor(Math.random() * shareInfo.length + 1)
  return {
    title: shareInfo[randomNum],
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

const getAutoPage = () => {
  var result = wx.getStorageSync("autoPage")
  if (typeof (result) == "undefined" || result == null || result.length == 0)
    return false
  return result
}

const setAutoPage = (result) => {
  try {
    wx.setStorageSync("autoPage", result)
  } catch (e) {
    console.log(e)
  }
}

const getLastNextBtn = () => {
  var result = wx.getStorageSync("showLastNextBtn")
  console.log(result)
  if (typeof (result) == "undefined" || result == null || result.length == 0)
    return true
  return result
}

const setLastNextBtn = (result) => {
  console.log(result)
  try {
    wx.setStorageSync("showLastNextBtn", result)
  } catch (e) {
    console.log(e)
  }
}

const sendFeedback = (content, contact) => new Promise((resolve, reject) => {
  const query = Bmob.Query('feedback')
  query.set("contact", contact)
  query.set("content", content)
  wx.getSystemInfo({
    success: function (res) {
      let mobileInfo = res.model + ''
      let screenInfo = res.platform + ' - ' + res.windowWidth + 'x' + res.windowHeight
      let wechatVersion = res.version + ''
      query.set("mobileInfo", mobileInfo)
      query.set("screenInfo", screenInfo)
      query.set("wechatVersion", wechatVersion)
      query.save().then(res => {
        resolve()
      }).catch(err => {
        reject()
      })
    },
    fail: function(res){
      query.save().then(res => {
        resolve()
      }).catch(err => {
        reject()
      })
    }
  });
})

module.exports = {
  formatTime,
  loadTypeBook,
  loadBook,
  loadCollect,
  saveCollect,
  getBookName,
  storeSubjectDone,
  getSubjectDone,
  getShareInfo,
  getAutoPage,
  setAutoPage,
  sendFeedback,
  getLastNextBtn,
  setLastNextBtn
}