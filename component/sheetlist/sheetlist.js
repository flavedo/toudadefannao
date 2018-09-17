Component({

  properties: {
    subjects: Array,
    options: Array,
    num: Number,
    isSpread: Boolean,
  },

  data: {
  },

  methods: {
    tapHead() {
      wx.vibrateShort()
      let { isSpread } = this.properties
      this.setData({
        isSpread: !isSpread
      })
    }
  }
})
