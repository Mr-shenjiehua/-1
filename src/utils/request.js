/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 11:53:07
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-10-09 10:22:45
 * @Description: 封装axios
 */
import axios from 'axios'
import { Message } from 'fawkes-lib'
// import Qs from 'qs' //qs一般装了axios就自带不用再装，如果没有，自己安装下
import storage from './storage'
import router from '../permission'
import { getSign } from '@/utils/sign'
import { Decrypt, Encrypt } from '@/utils/aes.js'

// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  // transformRequest: [function (data) {
  //   data = Qs.stringify(data) //序列化参数
  //   return data
  // }],
  timeout: 10000 // request timeout
})
//可单独加密解密,只需解密接口路径
const aesUrl = []

console.log('process.env.VUE_APP_BASE_API', process.env.VUE_APP_BASE_API)
// request interceptor
request.interceptors.request.use(
  config => {
    let accessToken = storage.get('access_token')
    if (accessToken) {
      config.headers['Fawkes-Auth'] = accessToken
    }
    if (config.pass) {
      config.params = getSign(config.params)
    }
    if (config.aesEncrypt) {
      if (config.data) {
        config.data = Encrypt(JSON.stringify(config.data))
      }
    }
    if (config.aesDecrypt) {
      aesUrl.push(config.url)
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    let res = response.data
    if (aesUrl.indexOf(response.config.url) > -1) {
      res = JSON.parse(Decrypt(res))
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code && res.code !== 8000000) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
    }
    return res
  },
  error => {
    if (error.response && error.response.data) {
      if (error.response.data.error) {
        Message({
          message: error.response.data.error_description || error.response.data.message,
          type: 'warning',
          duration: 5 * 1000
        })
      } else if (error.response.data.code !== 8000000) {
        switch (error.response.data.code) {
          case -8000060:
            storage.clear()
            if (router.currentRoute.path !== '/entry') {
              // 没有登录则跳转到login页面
              router.push({ path: '/' })
              window.location.reload()
            }
            break
        }
      }
    } else {
      if (error.message) {
        Message({
          message: error.message,
          type: 'warning',
          duration: 5 * 1000
        })
      }
    }

    return Promise.reject(error)
  }
)

request.all = axios.all.bind(request)
export default request