const util = require('../../utils/util.js')
const app = getApp()

const PRODUCTSIZE = 5
const STREAMSIZE = 4

Page({
  data: {
    time: util.formatDate(new Date()),
    ifTime: true,
    dataList: [],
    productList: [],
    streamList: [],
    hidden: false,
  },
  onLoad: function () {
    // this.initList({});
    this.init({ ifPullDown: true });
  }, 

  // 旧操作 -----------------------------------------------------------------<
  initList({ifPullDown, cb}) {
    const _this = this

    // 商品初始化
    this.initProduct().then(res => {
      // 下拉刷新处理
      let dataListCopy = ifPullDown ? [] : _this.data.dataList;

      let dataListTemp = Array.prototype.concat.apply(dataListCopy, res.rows)

      // stream初始化
      _this.streamInit(ifPullDown).then(res => {
        dataListTemp = Array.prototype.concat.apply(dataListTemp, res.data.data)

        // 设置数据
        _this.setData({
          dataList: dataListTemp,
          hidden: true
        })

        // 回调函数
        if (typeof cb == 'function') {
          cb()
        }
      });
    });
  },
  // -----------------------------------------------------------------<
  
  // stream初始化，推荐信息流
  streamInit(ifPullDown) {
    const _this = this

    return new Promise((resolve, reject) => {
      wx.request({ //?app_name=xxxxx&device_id=7564326355&uuid=867711021068618&openudid=bd3fc32793ae8854&manifest_version_code=100
        url: 'http://' + wx.getStorageSync('streamUrl') + '/?count=10 &min_behot_time=1457672142&bd_city=%E5%8C%97%E4%BA%AC%E5%B8%82&bd_latitude=40.08686&bd_longitude=116.336227&bd_loc_time=1457671953&loc_mode=7&loc_time=1457671306&latitude=40.092552660465&longitude=116.34280131795&city=%E5%8C%97%E4%BA%AC%E5%B8%82&iid=3827265717&&ac=wifi&channel=baidu&aid=13&app_name=xxxxx&version_code=100&device_platform=android&device_type=HM%202A&os_api=19&os_version=4.4.4&manifest_version_code=100&app_name=xxxxx&device_id=7564326355&uuid=867711021068618&openudid=bd3fc32793ae8854&manifest_version_code=100',
        method: 'GET',
        success(res) {
          if (res.data.message == 'success') {
            resolve(res)
          } else {
            console.log('bug')
            if (ifPullDown) {
              _this.setData({
                hidden: true
              })
            }
            _this.init({});
          }
        }
      })
    })
  },
  // 商品流
  initProduct() {
    const _this = this

    return new Promise((resolve, reject) => {
      util.request({
        url: '/article/merchandise/feed?size=' + PRODUCTSIZE,
        method: 'GET',
        _success(res) {
          resolve(res)
        }
      })
    })
  },

  // 初始化数据
  init({ ifPullDown, cb }) {
    const _this = this

    _this.initProduct().then(res => {
      const productList = res.rows;

      _this.setData({
        productList
      })
      
      _this.streamInit(ifPullDown).then(res => {
        const streamList = res.data.data

        _this.setData({
          streamList
        })

        _this.organizeList(ifPullDown, cb)
      })
    })
  },

  organizeList(ifPullDown, cb) {
    const _this = this

    const dataList = this.data.dataList
    const streamList = this.data.streamList.concat();
    const productList = this.data.productList.concat();

    // 下拉刷新或首次加载
    if (ifPullDown) {
      // 拷贝数组
      // const streamList = this.data.streamList.concat();

      // let count = 0;
      // let dataTemp = [];

      // streamList.forEach((item, index) => {
      //   let productList = this.data.productList;
      //   if (index != 0 && index % STREAMSIZE == 0) {
      //     streamList.splice(index + count, 0, productList.shift())
      //     this.setData({
      //       productList
      //     })
      //     count++;
      //   }
      // })
      // this.setData({
      //   dataList: streamList
      // })
      streamList.splice(4, 0, productList.shift())
      streamList.splice(9, 0, productList.shift())
      this.setData({
        dataList: streamList
      })
    } else {
      // 上拉加载
      // const dataList = this.data.dataList
      // const streamList = this.data.streamList.concat();
      // const productList = this.data.productList.concat();

      if (dataList.length > 0 && dataList[dataList.length - 1].hasOwnProperty('group_id')) {
        streamList.splice(2, 0, productList.shift())
        streamList.splice(7, 0, productList.shift())
        streamList.splice(12, 0, productList.shift())
      } else {
        streamList.splice(4, 0, productList.shift())
        streamList.splice(9, 0, productList.shift())
      }
      this.setData({
        dataList: this.data.dataList.concat(streamList)
      })
    }

    // 回调函数
    if (typeof cb == 'function') {
      cb()
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init({
      ifPullDown: true,
      cb: () => {
        this.setData({
          ifTime: false,
        })
        // 停止下拉刷新
        wx.stopPullDownRefresh();
      }
    });
  },
  // 上拉加载
  onReachBottom() {
    console.log('atBottom')

    // 显示加载更多
    this.setData({
      hidden: false,
    })
    // this.initList({});
    this.init({});
  },
  navigate(e) {
    const { articleid, groupid, videoid } = e.currentTarget.dataset;
    
    if (groupid) {
      wx.navigateTo({
        url: '../article/article?groupId=' + groupid + '&videoId=' + videoid,
      })
    } else {
      wx.navigateTo({
        url: '../product/product?productId=' + articleid,
      })
    }
  }
})
