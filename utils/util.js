const { historyBookData } = require('../lib/data/history.js')
const { lawBookData } = require('../lib/data/law.js')
const { maoBookData } = require('../lib/data/mao.js')
const { marxBookData } = require('../lib/data/marx.js')
const { moralBookData } = require('../lib/data/moral.js')

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

// all、single、multi、judge、
const loadTypeBook = (bookType, subjectType) => new Promise((resolve, reject) => {
  console.log(subjectType)
  loadBook(bookType).then(subjects => {
    switch(subjectType) {
      case 'all':
        resolve(subjects)
        break
      case 'single':
        resolve(subjects.filter(item =>{
          return item.questionType == 1
        }))
        break
      case 'judge': 
        resolve(subjects.filter(item => {
          return item.questionType == 2
        }))
        break
      case 'multi':
        resolve(subjects.filter(item => {
          return item.questionType == 3
        }))
        break
      default:
        resolve(subjects)
        break
    }
  }).catch(e => {
    reject(e)
  })
})

const storeSubjectDone = (bookType, subjectType, page) => {
	wx.setStorageSync(bookType + '-' + subjectType, page)
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
    default:
      return ''
  }
}

module.exports = {
  formatTime,
  loadTypeBook,
  loadBook,
  getBookName,
  storeSubjectDone,
  getSubjectDone
}