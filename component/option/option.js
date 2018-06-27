// component/option/option.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    question: String,
    word: String, // A B C D E
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true,
    isSelect: false,
    isRight: false,
    isRightResult: false,
    isWrongResult: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showOption() {
      this.setData({
        isShow: true,
        isSelect: false,
        isRight: false,
        isRightResult: false,
        isWrongResult: false
      })
    },

    selectOption() {
      this.setData({
        isShow: false,
        isSelect: true,
        isRight: false,
        isRightResult: false,
        isWrongResult: false
      })
    },

    rightOption() {
      this.setData({
        isShow: false,
        isSelect: false,
        isRight: true,
        isRightResult: false,
        isWrongResult: false
      })
    },

    rightResultOption() {
      this.setData({
        isShow: false,
        isSelect: false,
        isRight: false,
        isRightResult: true,
        isWrongResult: false
      })
    },

    wrongResultOption() {
      this.setData({
        isShow: false,
        isSelect: false,
        isRight: false,
        isRightResult: false,
        isWrongResult: true
      })
    },

    isSelect() {
      return this.data.isSelect
    },

    isShow() {
      return this.data.isShow
    }
  }
})
