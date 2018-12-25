// 非空
exports.notBlank = function (str) {
  return !(str == null || str == undefined || str == '')
}
// 用户名正则(4到16位,字母,数字,下划线,减号)
exports.userName = function (str) {
  return /^[a-zA-Z0-9_-]{4,16}$/.test(str)
}
// 手机号正则
exports.phone = function (str) {
  return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(str)
}
// 密码正则(6~18位英文或数字组合)
exports.password = function (str) {
  return /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,18}/.test(str)
}
// 密码强度(最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符)
exports.strongPsd = function (str) {
  return /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(str);
}
// 身份证正则
exports.id = function (str) {
  var checkCode = function (val) {
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    var code = val.substring(17);
    if(p.test(val)) {
      var sum = 0;
      for(var i=0;i<17;i++) {
          sum += val[i]*factor[i];
      }
      if(parity[sum % 11] == code.toUpperCase()) {
          return true;
      }
    }
    return false;
  }
  var checkDate = function (val) {
    var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    if(pattern.test(val)) {
      var year = val.substring(0, 4);
      var month = val.substring(4, 6);
      var date = val.substring(6, 8);
      var date2 = new Date(year+"-"+month+"-"+date);
      if(date2 && date2.getMonth() == (parseInt(month) - 1)) {
        return true;
      }
    }
    return false;
  }
  var checkProv = function (val) {
    var pattern = /^[1-9][0-9]/;
    var provs = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门"};
    if(pattern.test(val)) {
      if(provs[val]) {
        return true;
      }
    }
    return false;
  }
  var checkID = function (val) {
    if(checkCode(val)) {
      var date = val.substring(6,14);
      if(checkDate(date)) {
        if(checkProv(val.substring(0,2))) {
          return true;
        }
      }
    }
    return false;
  }
  return checkID(str);
}
// 中文姓名正则(不允许有特殊字符、数字和英文)
exports.ChineseName = function (str) {
  return /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(str)
}
// 邮件正则
exports.email = function (str) {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(str)
}
// qq(5至11位, {4, 10})
exports.qq = function (str) {
  return /^[1-9]\d{4,15}$/.test(str);
}
// 微信号正则，6至20位，以字母开头，字母，数字，减号，下划线
exports.wechat = function (str) {
  return /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(str)
}
// 车牌号正则
exports.carTag = function (str) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(str)
}
exports.bankNo = function (bankno) {
  /*银行卡号长度必须在16到19之间*/
  if(bankno.length < 16 || bankno.length > 19) {
    return false;
  }
  //全数字
  var num = /^\d*$/;
  if(!num.exec(bankno)) {
    return false;
  }
  //开头6位，银行卡号开头6位不符合规范
  var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
  if(strBin.indexOf(bankno.substring(0, 2)) == -1) {
    return false;
  }
  //Luhn校验
  return luhnCheck(bankno);
}
// -------------------------- 工具判定 --------------------------<
// 数字
// 整数(正负皆可)
exports.integer = function (str) {
  return /^-?\d+$/.test(str)
}
// 正整数
exports.positiveInteger = function (str) {
  return /^\d+$/.test(str)
}
// 负整数
exports.negtiveInetger = function (str) {
  return /^-\d+$/.test(str)
}
// 整数或浮点数(正负皆可)
exports.number = function (str) {
  return /^-?\d*\.?\d+$/.test(str)
}
// 整数或浮点数(正)
exports.positiveNumber = function (str) {
  return /^\d*\.?\d+$/.test(str)
}
// 整数或浮点数(负)
exports.negtiveNumber = function (str) {
  return /^-\d*\.?\d+$/.test(str)
}
// 函数类型
exports.ifFn = function (fn) {
  return typeof fn == 'function'
}

/*luhn银行卡算法*/
function luhnCheck (bankno) {
  var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
  var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
  var newArr=new Array();
  for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
    newArr.push(first15Num.substr(i,1));
  }
  var arrJiShu=new Array();  //奇数位*2的积 <9
  var arrJiShu2=new Array(); //奇数位*2的积 >9

  var arrOuShu=new Array();  //偶数位数组
  for(var j=0;j<newArr.length;j++){
    if((j+1)%2==1){//奇数位
        if(parseInt(newArr[j])*2<9)
        arrJiShu.push(parseInt(newArr[j])*2);
        else
        arrJiShu2.push(parseInt(newArr[j])*2);
    }
    else //偶数位
    arrOuShu.push(newArr[j]);
  }

  var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
  var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
  for(var h=0;h<arrJiShu2.length;h++){
    jishu_child1.push(parseInt(arrJiShu2[h])%10);
    jishu_child2.push(parseInt(arrJiShu2[h])/10);
  }

  var sumJiShu=0; //奇数位*2 < 9 的数组之和
  var sumOuShu=0; //偶数位数组之和
  var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
  var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
  var sumTotal=0;
  for(var m=0;m<arrJiShu.length;m++){
      sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
  }

  for(var n=0;n<arrOuShu.length;n++){
      sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
  }

  for(var p=0;p<jishu_child1.length;p++){
    sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
    sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
  }
  //计算总和
  sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
  //计算Luhm值
  var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
  var luhm= 10-k;

  if(lastNum==luhm && lastNum.length != 0){
     return true;
  } else {
     return false;
  }
}

// 针对上述正则的内置数组(数组元素与函数名相同)
exports.patternArr = function () {
  return ['userName', 'phone', 'password', 'strongPsd', 'id', 'bankNo', 'ChineseName', 'email', 'qq', 'wechat', 'carTag', 'notBlank', 'integer', 'positiveInteger', 'negtiveInetger', 'number', 'positiveNumber', 'negtiveNumber']
}