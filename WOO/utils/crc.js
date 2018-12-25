// "Class" for calculating CRC8 checksums...
function CRC8(polynomial) { // constructor takes an optional polynomial type from CRC8.POLY
  if (polynomial == null) polynomial = CRC8.POLY.CRC8_CCITT
  this.table = CRC8.generateTable(polynomial);
}

// Returns the 8-bit checksum given an array of byte-sized numbers
CRC8.prototype.checksum = function (byte_array) {
  var c = 0

  for (var i = 0; i < byte_array.length; i++)
    c = this.table[(c ^ byte_array[i]) % 256]

  return c;
}

// returns a lookup table byte array given one of the values from CRC8.POLY 
CRC8.generateTable = function (polynomial) {
  var csTable = [] // 256 max len byte array

  for (var i = 0; i < 256; ++i) {
    var curr = i
    for (var j = 0; j < 8; ++j) {
      if ((curr & 0x80) !== 0) {
        curr = ((curr << 1) ^ polynomial) % 256
      } else {
        curr = (curr << 1) % 256
      }
    }
    csTable[i] = curr
  }

  return csTable
}

// This "enum" can be used to indicate what kind of CRC8 checksum you will be calculating
CRC8.POLY = {
  CRC8: 0xd5,
  CRC8_CCITT: 0x07,
  CRC8_DALLAS_MAXIM: 0x31,
  CRC8_SAE_J1850: 0x1D,
  CRC_8_WCDMA: 0x9b,
}

// ----------------------------------------------------------<
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

function ToCRC16(str, isReverse) {
  return toString(CRC16(isArray(str) ? str : strToByte(str)), isReverse);
};

function strToByte(str) {
  var tmp = str.split(''), arr = [];
  for (var i = 0, c = tmp.length; i < c; i++) {
    var j = encodeURI(tmp[i]);
    if (j.length == 1) {
      arr.push(j.charCodeAt());
    } else {
      var b = j.split('%');
      for (var m = 1; m < b.length; m++) {
        arr.push(parseInt('0x' + b[m]));
      }
    }
  }
  return arr;
};

function convertChinese(str) {
  var tmp = str.split(''), arr = [];
  for (var i = 0, c = tmp.length; i < c; i++) {
    var s = tmp[i].charCodeAt();
    if (s <= 0 || s >= 127) {
      arr.push(s.toString(16));
    }
    else {
      arr.push(tmp[i]);
    }
  }
  return arr;
};

function filterChinese(str) {
  var tmp = str.split(''), arr = [];
  for (var i = 0, c = tmp.length; i < c; i++) {
    var s = tmp[i].charCodeAt();
    if (s > 0 && s < 127) {
      arr.push(tmp[i]);
    }
  }
  return arr;
};

function strToHex(hex, isFilterChinese) {
  hex = isFilterChinese ? filterChinese(hex).join('') : convertChinese(hex).join('');

  //清除所有空格
  hex = hex.replace(/\s/g, "");
  //若字符个数为奇数，补一个空格
  hex += hex.length % 2 != 0 ? " " : "";

  var c = hex.length / 2, arr = [];
  for (var i = 0; i < c; i++) {
    arr.push(parseInt(hex.substr(i * 2, 2), 16));
  }
  return arr;
};

function padLeft(s, w, pc) {
  if (pc == undefined) {
    pc = '0';
  }
  for (var i = 0, c = w - s.length; i < c; i++) {
    s = pc + s;
  }
  return s;
};

function toString(arr, isReverse) {
  if (typeof isReverse == 'undefined') {
    isReverse = true;
  }
  var hi = arr[0], lo = arr[1];
  return padLeft((isReverse ? hi + lo * 0x100 : hi * 0x100 + lo).toString(16).toUpperCase(), 4, '0');
};

function CRC16(data) {
  var len = data.length;
  if (len > 0) {
    var crc = 0xFFFF;

    for (var i = 0; i < len; i++) {
      crc = (crc ^ (data[i]));
      for (var j = 0; j < 8; j++) {
        crc = (crc & 1) != 0 ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
      }
    }
    var hi = ((crc & 0xFF00) >> 8); //高位置
    var lo = (crc & 0x00FF); //低位置

    // return [hi, lo];
    return [lo, hi]; // 大端模式
  }
  return [0, 0];
};


function ToCRC16(str, isReverse) {
  return toString(CRC16(isArray(str) ? str : strToByte(str)), isReverse);
};

function ToModbusCRC16(str, isReverse) {
  return toString(CRC16(isArray(str) ? str : strToHex(str)), isReverse);
};



/**
* 给命令增加CRC 16进制
*
* @param hex
* @return 16进制
*/
function getCRCCmd(hex) {
  var hexTemp = hex;
  if (hex.toUpperCase().startsWith("0X")) {
    hexTemp = hex.substr(4);
  } else if (hex.toUpperCase().startsWith("AA")) {
    hexTemp = hex.substr(2);
  }
  // -------《
  // var byte_array = hexTemp.split('').map(function (x) { return x.charCodeAt(0) })
  // var crc8 = new CRC8()
  // const crc8Code = crc8.checksum(byte_array);
  // return hex + ' ' + crc8Code;
  // -----<
  // crc16
  return hex + ' ' + getCRCStr(hexTemp);
}

/**
* 获取CRC 16进制
*
* @param data
* @return
*/
function getCRCStr(data) {
  return ToModbusCRC16(data);
}

module.exports = {
  ToCRC16: ToCRC16,
  ToModbusCRC16: ToModbusCRC16,
  getCRCCmd: getCRCCmd
}