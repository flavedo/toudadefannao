const { lawBookData } = require('../lib/data/law.js')

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

const loadBook = book => new Promise((resolve, reject) => {
  try {
    console.log(book)
    switch(book) {
      case 'marx': 
        resolve(lawBookData())
        break
      default:
        reject()
        break;
    }
  } catch(e) {
    console.log("error")
    reject(e)
  }
})

module.exports = {
  formatTime,
  loadBook
}