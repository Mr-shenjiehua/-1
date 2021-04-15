/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 11:53:07
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-08-27 15:42:51
 * @Description: 封装axios
 */
import axios from 'axios'
import { Message } from 'fawkes-lib'
// import Qs from 'qs' //qs一般装了axios就自带不用再装，如果没有，自己安装下
import Storage from '@/utils/storage'
import router from '../permission'

// create an axios instance
const axiosexport = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
axiosexport.interceptors.request.use(
  config => {
    let accessToken = Storage.get('access_token')
    if (accessToken) {
      config.headers['Fawkes-Auth'] = accessToken
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
axiosexport.interceptors.response.use(
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
    const res = response

    // if the custom code is not 20000, it is judged as an error.
    if (res.data.code && res.data.code !== 8000000) {
      Message({
        message: res.data.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return res
  },
  error => {
    if (error.response && error.response.data) {
      if (error.response.data.error) {
        if (error.response.data.error == 'invalid_grant') {
          Message({
            message: '登录失败，请选择正确的登录方式',
            type: 'warning',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: error.response.data.error_description || 'message',
            type: 'warning',
            duration: 5 * 1000
          })
        }
      } else if (error.response.data.code !== 8000000) {
        switch (error.response.data.code) {
          case -8000060:
            if (router.currentRoute.path != '/login') {
              router.push({ path: '/login', query: { refresh: true } })
            }
            break
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosexport