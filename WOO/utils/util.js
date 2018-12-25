const cryptoJs =  require('./crypto-js/crypto-js');
const { DOMAIN, SALT } = require('./config.js');

const base64DeCode = (content) => {
  return cryptoJs.enc.Utf8.stringify(cryptoJs.enc.Base64.parse(content));
}

const aesEncrypt = (content) => {
  const srcs = cryptoJs.enc.Utf8.parse(content);
  const key = cryptoJs.enc.Utf8.parse(config.AES_KEY);  //十六位十六进制数作为密钥
  const encrypted = cryptoJs.AES.encrypt(srcs, key, { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 });
  return encrypted.toString();
}

const sha1 = (content) => {
  return cryptoJs.SHA1(content).toString()
}

const md5 = (content) => {
  return cryptoJs.MD5(content).toString()
}

// 随机数
const randomNumber = (lowerValue, upperValue) => {
  var choices = upperValue - lowerValue + 1;
  return Math.floor(Math.random() * choices + lowerValue);
}

// 封装小程序数据请求
const request = ({url, method, data, _success}) => {
  // wx.showLoading({
  //   title: '加载中',
  //   mask: true
  // })

  wx.request({
    url: DOMAIN + url,
    header: {
      'x-app-id': 'ecypc8htcxr8lq7a',
      'x-site-code': 'default',
      'x-channel': 'default',
      'x-dev-id': 'x-dev-id:xyz-abc',
      'x-token': 'access-token-test'
    },
    method: method,
    data: data,
    success (res) {
      const data = res.data;

      /*登录失效*/
      // if (data.result === false) {
      //   wx.showToast({
      //     title: data.message,
      //     icon: "none",
      //     mask: 'true',
      //     duration: 2000
      //   })
      //   return
      // }

      if (data.code == 1) {
        _success(data.result);
      } else {
        wx.showToast({
          title: data.errorDesc,
          duration: 2000,
          icon: 'none',
          mask: true
        })
      }
    },
    fail () {
      wx.showToast({
        title: '接口调用失败，请稍后再试',
        icon: "none",
        mask: 'true',
        duration: 2000
      })
    }
  })
}

// 封装上传图片
const uploadImg = ({ url, filePath, name, formData, _success }) => {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.uploadFile({
    url: config.DOMAIN + url,
    filePath: filePath,
    name: name,
    header: {
      Cookie: 'SESSION=' + wx.getStorageSync('token')
    },
    formData: formData,
    success(res) {
      try {
        const data = JSON.parse(res.data);
        switch (data.status) {
          case '0':
            _success(data.data);
            break;
          case '1':
            wx.showToast({
              title: data.msg,
              icon: "none",
              mask: 'true',
              duration: 2000
            })
            break;
          default:
            _success(data.data);
        }
      } catch (e) {
        console.log(e)
        wx.showToast({
          title: '图片过大，上传失败',
          icon: 'none',
          mask: true,
          duration: 2000
        })
      }
      
    },
    complete() {
      wx.hideLoading({});
    }
  })
}

// 时间戳转换
const formatDate = (date, timeRange = 0) => {
  let dateTemp = new Date(new Date(date).getTime() + timeRange);
  let y = dateTemp.getFullYear();
  let m = dateTemp.getMonth() + 1;
  let d = dateTemp.getDate();
  return y + "年" + (m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + "日";
}
const formatTime = time => {
  let now = new Date(time);
  return now.toTimeString().substr(0, 5);
}


module.exports = {
  sha1,
  request,
  formatDate,
  formatTime,
  uploadImg,
  randomNumber,
  md5,
  base64DeCode,
}
