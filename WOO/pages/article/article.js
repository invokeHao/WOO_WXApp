const WxParse = require('../../utils/wxParse/wxParse.js');
const util = require('../../utils/util.js')

const touTiaoDomain = 'http://is.snssdk.com'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { groupId, videoId } = options;

    if(videoId != 'undefined' && groupId != 'undefined') {
      // 初始化video
      this.initVideo(groupId, videoId)
      this.initStreamArticle(groupId)
    } else if (groupId != 'undefined') {
      // 初始化stream流文章
      this.initStreamArticle(groupId)
    } else {
      wx.showToast({
        title: '文章初始化错误',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }
  },

  initStreamArticle(id) {
    const _this = this
    wx.request({
      url: touTiaoDomain + '/article/content/11/1/' + id + '/' + id +'/1/',
      method: 'GET',
      success(res) {
        if (res.data.message == 'success') {
          _this.parseHtml(res.data.data.content)
        }
      }
    })
  },

  initVideo(groupId, videoId) {
    const _this = this
    wx.request({
      url: touTiaoDomain + '/video/urls/1/toutiao/mp4/' + videoId,
      method: 'GET',
      success(res) {
        if (res.data.message == 'success') {
          const { poster_url, video_list } = res.data.data

          // 此处拿第一个视频
          const main_url = util.base64DeCode(video_list.video_2.main_url)

          _this.setData({
            mainUrl: main_url
          })
        }
      }
    })
  },
  parseHtml(str) {
    /**
    * WxParse.wxParse(bindName, type, data, target, imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    var that = this;
    WxParse.wxParse('article', 'html', str, that, 5);
  }
})