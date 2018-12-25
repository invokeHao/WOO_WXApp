var patterns = require('./pattern.js')

var validatesArr = patterns.patternArr()

// 按序认证
function validate (validates, success) {
  // validates参数合法性(认证参数)
  if (!(validates instanceof Array)) {
    console.error('parameter error: first parameter should be an Array')
    return
  }
  // success参数合法性(成功回调)
  if (!patterns.ifFn(success)) {
    console.error('parameter error: ' + validates[i].success + ', success should be a function')
    return
  }
  /*-------------------------------------------------------------------------------------------------*/
  for (var i in validates) {
    // cb参数合法性(认证失败回调)
    if (!patterns.ifFn(validates[i].cb)) {
      console.error('parameter error: ' + validates[i].cb + ', cb should be a function')
      return
    }
    // 使用自定义正则(如果传入function)
    if (typeof validates[i].requirement == 'function' && !validates[i].requirement(validates[i].value)) {
      validates[i].cb()
      return
    } else {
      // 使用内置正则
      for (var j in validatesArr) {
        if (validates[i].requirement == validatesArr[j]) {
          if (!patterns[validatesArr[j]](validates[i].value)) {
            validates[i].cb()
            return
          }
        }
      }
    }
  }
  /*-------------------------------------------------------------------------------------------------*/
  // 成功回调
  success();
}

// 一次性认证全部，返回错误参数key值
var validateAll_Arr = []
function validateAll (validates, error, success) {
  // validates参数合法性(认证参数)
  if (!(validates instanceof Array)) {
    console.error('parameter error: first parameter should be an Array')
    return
  }
  // error参数合法性(失败回调)
  if (!patterns.ifFn(error)) {
    console.error('parameter error: ' + validates[i].success + ', success should be a function')
    return
  }
  // success参数合法性(成功回调)
  if (!patterns.ifFn(success)) {
    console.error('parameter error: ' + validates[i].success + ', success should be a function')
    return
  }
  /*-------------------------------------------------------------------------------------------------*/
  // 每次调用，先清空数组
  validateAll_Arr = []
  for (var i in validates) {
    // 使用自定义正则(如果传入function)
    if (typeof validates[i].requirement == 'function' && !validates[i].requirement(validates[i].value)) {
      validateAll_Arr.push(validates[i].key)
      continue
    } else {
      // 使用内置正则
      for (var j in validatesArr) {
        if (validates[i].requirement == validatesArr[j]) {
          if (!patterns[validatesArr[j]](validates[i].value)) {
            validateAll_Arr.push(validates[i].key)
            continue
          }
        }
      }
    }
  }
  if (validateAll_Arr.length != 0) {
    // 失败返回参数错误的数组
    error(validateAll_Arr)
  } else {
    // 成功回调
    success();
  }
}


module.exports = {
  validate: validate,
  validateAll: validateAll,
  pattern: patterns
}