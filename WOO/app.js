const { INIT_DOMAIN, SALT } = require('./utils/config.js')
const util = require('./utils/util.js')

App({
  onLaunch: function () {
    this.init();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        util.request({
          url:'/auth/signon/3rd/minip?code=' + res.code,
          method: 'POST',
          _success(res) {
            console.log(res)
          }
        })
      }
    })
  },
  init() {
    const _this = this;

    const { brand, model, language, screenWidth, screenHeight, pixelRatio, system, platform } = wx.getSystemInfoSync();

    const resolution = screenWidth * pixelRatio + '*' + screenHeight * pixelRatio,
          display_density = pixelRatio,
          carrier = "CHINA MOBILE",
          os = system.split(' ')[0],
          os_version = system.split(' ')[1],
          device_brand = brand,
          device_model = model;
    
    const initStr = JSON.stringify({ resolution, display_density, carrier, os, os_version, language }).replace('{', '').replace('}', '')

    const data = {
      "header": {
        resolution, display_density, carrier, os, os_version, language,
        "sig_hash": util.md5(initStr + SALT)
      }
    }

    wx.request({
      url: INIT_DOMAIN + '/service/init/',
      method: 'POST',
      data: data,
      success(res) {
        if (res.data.message !== 'success') {
          wx.showToast({
            title: '初始化失败，请稍后重试',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          return
        }

        // 拉取steam
        _this.getStream();
      }
    })
  },
  // 拉去stream
  getStream() {
    const _this = this
    wx.request({
      url: INIT_DOMAIN + '/service/settings/stream/?uuid=864394010536169&openudid=14dda995d1522288&app_name=news_xxx_xxx&device_id=7564326355&version_code=100',
      method: 'GET',
      success(res) {
        wx.setStorageSync('streamUrl', res.data.api_report[0].pattern)
      }
    })
  },
  globalData: {
  }
})