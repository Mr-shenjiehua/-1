  /*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 16:43:30
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-09-29 09:05:43
 * @Description: 工具类，根据功能划分
 */
import storage from './storage'
/**
 * @description: 解析列表为树形
 * @param {Array} data 原始列表
 * @param {String} idName id标识值
 * @param {String} pidName pid标识值
 * @return: val 树形列表 map 对应map
 */
export function transTree(data, idName, pidName) {
  data.forEach((item) => {
    delete item.children
  })
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  var map = {}
  data.forEach((item) => {
    map[item[idName]] = item
  })
  var val = []
  data.forEach((item) => {
    // 以当前遍历项，的pid,去map对象中找到索引的id
    var parent = map[item[pidName]]
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item)
    }
  })
  return {
    val,
    map
  }
}

/**
 * @description: 执行js表达式，兼容性实现eval()
 * @param {type} 
 * @return: 
 */
export function evil(fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}

/**
 * @description 生成UUID
 * @param {Integer} len uuid长度
 * @param {Integer} radix uuid基数
 * @returns {String} UUID
 */
export function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * created: zhang_xm3
 * time: 2019/08/22
 * @description 导出xlsx文件通用方法
 * @param {Blob} response
 * @returns
 */
export function exportFile(response) {
  const blob = new Blob([response.data], { type: response.headers['content-type'] }) // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  const desprsitions = response.headers['content-disposition'].split(';')
  let filename = ''
  for (let i = 0; i < desprsitions.length; i++) {
    if (desprsitions[i].indexOf('filename') > -1) {
      const filenames = desprsitions[i].split('=')
      if (filenames.length > 1) {
        filename = decodeURI(filenames[1].trim())
      }
    }
  }
  if ('download' in document.createElement('a')) {
    const downloadElement = document.createElement('a')
    let href = ''
    if (window.URL) {
      href = window.URL.createObjectURL(blob)
    } else {
      href = window.webkitURL.createObjectURL(blob)
    }
    downloadElement.href = href
    downloadElement.download = filename
    document.body.appendChild(downloadElement)
    downloadElement.click()
    if (window.URL) {
      window.URL.revokeObjectURL(href)
    } else {
      window.webkitURL.revokeObjectURL(href)
    }
    document.body.removeChild(downloadElement)
  } else {
    navigator.msSaveBlob(blob, filename)
  }
}

/**
 * @description: 获取本地语言设置 当未配置时，选择浏览器默认语言
 * @param {type} 
 * @return: 
 */
export function getLangConfig() {
  let language = storage.get('lang_config')
  if (language) return language
  if (navigator.appName == 'Netscape') {
    language = navigator.language || navigator.userLanguage
  }
  else {
    language = navigator.browserLanguage || navigator.userLanguage
  }
  if (language.indexOf('en') > -1) {
    language = "en"
  }
  else if (language.indexOf('zh') > -1) {
    language = "zh"
  }
  else {
    language = "en"
  }
  return language
}

/**
 * @description: 通过X1解析出用户名
 * @param {X1} 
 * @return: 解析后的用户名
 */
export function getUserNameByX1(X1) {
  let i = 1
  let j = 1
  let k = 1
  let m = 1
  let s = X1
  let buff = []
  let strkey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"//"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  let t1 = null
  let t2 = null
  let n = 0
  const byteToString = (arr) => {
    if (typeof arr === 'string') {
      return arr
    }
    var str = '',
      _arr = arr
    for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/)
      if (v && one.length == 8) {
        var bytesLength = v[0].length
        var store = _arr[i].toString(2).slice(7 - bytesLength)
        for (var st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2)
        }
        str += String.fromCharCode(parseInt(store, 2))
        i += bytesLength - 1
      } else {
        str += String.fromCharCode(_arr[i])
      }
    }
    return str
  }
  const stringToBytes = (str) => {
    var bytes = new Array()
    var len, c
    len = str.length
    for (var i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0)
        bytes.push(((c >> 12) & 0x3F) | 0x80)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0)
        bytes.push((c & 0x3F) | 0x80)
      } else {
        bytes.push(c & 0xFF)
      }
    }
    return byteToString(bytes)
  }
  for (i = 0; i < s.length; i = i + 2) {
    t1 = s.substring(i, i + 1)
    t2 = s.substring(i + 1, i + 2)
    k = strkey.indexOf(t1)
    m = strkey.indexOf(t2)
    j = parseInt(m / 8)
    m = m - j * 8
    buff[n] = stringToBytes((stringToBytes((j * strkey.length + k).toString()) ^ m).toString())
    n = n + 1
  }
  console.log(buff)
  let decode = byteToString(buff)  //decode应该返回"chen_m2"
  return decode
}

/**
 * @description: 获取url中的query
 * @param {variable} 需要获取的key值
 */
export function getQueryVariable(variable) {
  let rawQuery = (window.location.search ? window.location.search.substring(1) : '') || window.location.href.split('?')[1]
  if (!!!rawQuery) {
    return null
  }
  var reg = new RegExp("(^|&)" + variable + "=([^&]*)(&|$)")
  var r = rawQuery.match(reg)//search,查询？后面的参数，并匹配正则
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
/**
 * @description: 获取url参数对象或字符串
 * @param {String} url
 * @param {String} 指定参数
 * @return {type} 
 */
export function getParamByUrl(url, par) {
  var fileUrl = '' //文件地址
  var listParam = '' //参数集合
  var listParamObj = {} //
  var listParamArr = '' //包含所有参数
  //去掉hash
  url = url.split('#')[0]
  //获取文件地址
  fileUrl = url.split('?')[0]
  listParam = url.split('?')
  if (listParam.length > 1) {
    listParam.shift()
    var listParam2 = listParam.join()
    listParamArr = listParam2.split('&')
    listParamArr.forEach(function (ele) {
      var temp = ele.split('=')
      listParamObj[temp[0]] = temp[1]
    })
  } else {
    console.log('没有参数')
  }
  if (par == 'all') {
    //返回全部参数
    return listParamObj
  } else {
    //返回指定参数
    for (const key in listParamObj) {
      if (key == par) {
        return JSON.parse('{' + '"' + par + '"' + ':' + '"' + listParamObj[par] + '"' + '}')
      } else {
        console.log('没有传入的参数')
      }
    }
  }
}