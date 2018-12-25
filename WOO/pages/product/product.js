const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    max: 100,
    sliderValue: 80,
    productDetail: {},
  },

  onLoad(options) {
    const { productId } = options
    this.initProduct(productId)
  },

  initProduct(productId) {
    const _this = this

    util.request({
      url: `/article/merchandise/${productId}/detail`,
      method: 'GET',
      _success(res) {

        // 省略数据中两位小数后
        const productCommissionAmountArr = res.productCommissionAmount.toString().split('.')
        const sliderValue = parseFloat(productCommissionAmountArr[0] + '.' + productCommissionAmountArr[1].substring(0, 2))
        const max = res.productPriceAmount
        
        _this.setData({
          productDetail: res,
          sliderValue,
          max
        })
      }
    })
  },
  // 设置sliderValue
  slideChange(e) {
    this.setData({
      sliderValue: e.detail.value
    })
  }
})