import HmacSHA1 from 'crypto-js/hmac-sha1'
import Base64 from 'crypto-js/enc-base64'
import { isEmpty } from 'fawkes-lib/src/utils/util'
import { CLIENT, CLIENT_SECRET } from '@/settings'

//获取加密后的url参数字符串
const getUrl = (rest) => {
  let Params = ""
  let ts = (new Date()).valueOf()
  let ttl = 30
  let obj = rest
  Params += "ts=" + ts + "&ttl=" + ttl + "&uid=" + CLIENT + (isEmpty(obj) ? '' : "&" + objTransUrlParams(obj))
  let ParamArr = sortUrlParams(Params)
  ParamArr = objKeySort(ParamArr)
  let paramstr = []
  for (let i in ParamArr) {
    paramstr.push(i + "=" + ParamArr[i])
  }
  paramstr = paramstr.join("&")
  let signWordArray = HmacSHA1(paramstr, CLIENT_SECRET)
  let sign = Base64.stringify(signWordArray)
  let encodeSign = encodeURIComponent(sign)
  return paramstr + "&sign=" + encodeSign
}

//获取加密后的参数对象
const getSign = (rest) => {
  let Params = ""
  let ts = (new Date()).valueOf()
  let ttl = 30
  let obj = rest
  Params += "ts=" + ts + "&ttl=" + ttl + "&uid=" + CLIENT + (isEmpty(obj) ? '' : "&" + objTransUrlParams(obj))
  let ParamArr = sortUrlParams(Params)
  ParamArr = objKeySort(ParamArr)
  let paramstr = []
  for (let i in ParamArr) {
    paramstr.push(i + "=" + ParamArr[i])
  }
  paramstr = paramstr.join("&")
  let signWordArray = HmacSHA1(paramstr, CLIENT_SECRET)
  let sign = Base64.stringify(signWordArray)
  return { sign, ts, ttl, uid: CLIENT, ...ParamArr }
}

const objKeySort = (obj) => {
  let newkey = Object.keys(obj).sort()
  let newObj = {}
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  return newObj
}

const sortUrlParams = (str) => {
  if (typeof str !== 'string') {
    return {}
  }
  let paramObj = {}
  let paramArr = decodeURI(str).split('&')
  // let paramArr = str.split('&');
  for (let i = 0; i < paramArr.length; i++) {
    let tmp = paramArr[i].split('=')
    let key = tmp[0]
    let value = tmp[1] || ""
    //if (typeof value === 'string' && isNaN(Number(value)) === false && value !== "") {
    //  value = Number(value);
    //}
    if (typeof paramObj[key] === 'undefined') {
      paramObj[key] = value
    } else {
      let newValue = Array.isArray(paramObj[key]) ? paramObj[key] : [
        paramObj[key]
      ]
      newValue.push(value)
      paramObj[key] = newValue
    }
  }
  return paramObj
}

const objTransUrlParams = (obj) => {
  const params = []
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    if (typeof value === 'undefined') {
      value = ''
    }
    params.push([key, value].join('='))
  })
  return params.join('&')
}

export {
  getUrl,
  getSign
}
