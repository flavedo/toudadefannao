const { historyBookData } = require('../lib/data/history.js')
const { lawBookData } = require('../lib/data/law.js')
const { maoBookData } = require('../lib/data/mao.js')
const { marxBookData } = require('../lib/data/marx.js')
const { moralBookData } = require('../lib/data/moral.js')
var Bmob = require('Bmob-1.6.6.min.js')

const store = {
  currentBookType: '',
  currentSubjectType: '',
  currentSubjects: [],
  currentUserOptions: []
}

const setStore = (bookType, subjectType, subjects) => {
  store.currentBookType = bookType
  store.currentSubjectType = subjectType,
  store.currentSubjects = subjects
}

const clearStore = () => {
  store.currentBookType = ''
  store.currentSubjectType = '',
  store.currentSubjects = [],
  store.currentUserOptions = {}
}

const getStore = (bookType, subjectType) => {
  if (bookType == store.currentBookType && subjectType == store.currentSubjectType) {
    return store.currentSubjects
  }
  return null
}

const setUserOptions = (bookType, subjectType, page, options) => {
  if (bookType == store.currentBookType && subjectType == store.currentSubjectType) {
    store.currentUserOptions[page] = options
  }
}

const getUserOptions = (bookType, subjectType, page) => {
  if (bookType == store.currentBookType && subjectType == store.currentSubjectType) {
    return store.currentUserOptions[page]
  }
  return null
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

const addCollect = (bookType, subject, userid) => new Promise((resolve, reject) => {
  let { questionNum, questionType } = subject
  checkCollect(bookType, subject, userid).then(res => {
    reject("收藏已存在")
  }).catch(todos => {
    const query = Bmob.Query('collect')
    query.set("bookType", bookType)
    query.set("questionNum", questionNum + '' )
    query.set("questionType", questionType + '')
    query.set("userid", userid)
    query.save().then(res => {
      resolve(res.objectId)
    }).catch(err => {
      reject(err)
    })
  })
})

const addCollects = (bookType, subjects, userid) => new Promise((resolve, reject) => {
  const queryArray = new Array();
  for (let i in subjects) {
    console.log(bookType, subjects[i], userid)
    var query = Bmob.Query('collect');
    query.set("bookType", bookType)
    query.set("questionNum", subjects[i].questionNum + '')
    query.set("questionType", subjects[i].questionType + '')
    query.set("userid", userid)
    queryArray.push(query);
  }

  Bmob.Query('collect').saveAll(queryArray).then(result => {
    resolve(result)
  }).catch(err => {
    reject(err)
  });
})

const deleteCollect = (bookType, subject, userid) => new Promise((resolve, reject) => {
  let { questionNum, questionType } = subject
  const query = Bmob.Query('collect')
  query.equalTo("bookType", "==", bookType)
  query.equalTo("questionNum", "==", questionNum)
  query.equalTo("questionType", "==", questionType)
  query.equalTo("userid", "==", userid)
  query.find().then(todos => {
    todos.destroyAll().then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
})

const checkCollect = (bookType, subject, userid) => new Promise((resolve, reject) => {
  let { questionNum, questionType } = subject
  const query = Bmob.Query('collect')
  query.equalTo("bookType", "==", bookType)
  query.equalTo("questionNum", "==", questionNum)
  query.equalTo("questionType", "==", questionType)
  query.equalTo("userid", "==", userid)
  query.find().then(res => {
    res.length > 0 ? resolve(res) : reject(res)
  }).catch(err => {
    reject(err)
  })
})

const countCollect = (bookType, userid) => new Promise((resolve, reject) => {
  const query = Bmob.Query('collect')
  query.equalTo("bookType", "==", bookType)
  query.equalTo("userid", "==", userid)
  query.count().then(res => {
    console.log('countCollect', res)
    resolve(res)
  }).catch(err => {
    reject(err)
  })
})

const loadCollectData = (bookType, userid) => new Promise((resolve, reject) => {
  loadBook(bookType).then(allSubjects => {
    let allLength = allSubjects.length
    const query = Bmob.Query('collect')
    query.equalTo("bookType", "==", bookType)
    query.equalTo("userid", "==", userid)
    query.limit(allLength)
    
    query.find().then(res => {
      let subSubjects = allSubjects.filter(subject => {
        for (let i in res) {
          if (res[i].questionNum === subject.questionNum)
            return true
        }
        return false
      })
      resolve(subSubjects)
    }).catch(err => {
      reject(err)
    })
  }).catch(e => {
    reject(err)
  })
})

// all、single、multi、judge、collect
const getSubjectCount = (bookType, subjectType, userid) => new Promise((resolve, reject) => {
  loadSubjectData(bookType, subjectType, userid).then(subjects => {
    resolve(subjects.length)
  }).catch(err => {
    reject(err)
  }) 
})

// all、single、multi、judge、collect
const getSubjectData = (bookType, subjectType, userid, page) => new Promise((resolve, reject) => {
  loadSubjectData(bookType, subjectType, userid).then(subjects => {
    resolve(subjects[page])
  }).catch(err => {
    reject(err)
  })
})

const getSubjectDatas = (bookType, subjectType, userid) => new Promise((resolve, reject) => {
  loadSubjectData(bookType, subjectType, userid).then(subjects => {
    resolve(subjects)
  }).catch(err => {
    reject(err)
  })
})

// all、single、multi、judge、collect
const loadSubjectData = (bookType, subjectType, userid) => new Promise((resolve, reject) => {
  if (store.currentBookType == bookType && store.currentSubjectType == subjectType) {
    resolve(store.currentSubjects)
    return;
  }
  switch (subjectType) {
    case 'all':
      loadBook(bookType).then(subjects => {
        setStore(bookType, subjectType, subjects)
        resolve(subjects)
      }).catch(e => {
        reject(e)
      })
      break
    case 'single':
      loadBook(bookType).then(subjects => {
        let subSubjects = subjects.filter(item => {
          return item.questionType == 1
        })
        setStore(bookType, subjectType, subSubjects)
        resolve(subSubjects)
      }).catch(e => {
        reject(e)
      })
      break
    case 'judge':
      loadBook(bookType).then(subjects => {
        let subSubjects = subjects.filter(item => {
          return item.questionType == 2
        })
        setStore(bookType, subjectType, subSubjects)
        resolve(subSubjects)
      }).catch(e => {
        reject(e)
      })
      break
    case 'multi':
      loadBook(bookType).then(subjects => {
        let subSubjects = subjects.filter(item => {
          return item.questionType == 3
        })
        setStore(bookType, subjectType, subSubjects)
        resolve(subSubjects)
      }).catch(e => {
        reject(e)
      })
      break
    case 'collect':
      loadCollectData(bookType, userid).then(subjects => {
        setStore(bookType, subjectType, subjects)
        resolve(subjects)
      }).catch(e => {
        reject(e)
      })
      break
    default:
      reject('未知题目类型')
      break
  }
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
    reject(e)
  }
})

module.exports = {
  getSubjectData, 
  getSubjectDatas,
  getSubjectCount,
  addCollect,
  addCollects,
  deleteCollect,
  checkCollect,
  clearStore,
  setUserOptions,
  getUserOptions
}