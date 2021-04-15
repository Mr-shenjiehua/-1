/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-23 14:30:50
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2019-11-23 16:21:02
 * @Description: request缓存，非get方法慎用
 */

/**
 * 使用方法
 * 
  import cache from '@/utils/cache'
  export function getSvgs(params) {
    return request({
      url: process.env.VUE_APP_SVG_URL + '/icons',
      method: 'get',
      params: {
        ...params
      },
      adapter: cache({
        time: 1000 //time 表示可缓存的时间，默认为0，在没有清除内存之前永久缓存（浏览器窗口标签关闭，应用程序关闭等会清除内存）
      })
    })
  } 
 */
import request from '@/utils/request'

// 数据存储
export const cache = {
  data: {},
  set(key, data) {
    this.data[key] = data
  },
  get(key) {
    return this.data[key]
  },
  clear(key) {
    delete this.data[key]
  }
}

// 建立唯一的key值
export const buildUniqueUrl = (url, method, params = {}, data = {}) => {
  const paramStr = (obj) => {
    if (toString.call(obj) === '[object Object]') {
      return JSON.stringify(Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key]
        return result
      }, {}))
    } else {
      return JSON.stringify(obj)
    }
  }
  url += `?${paramStr(params)}&${paramStr(data)}&${method}`
  return url
}

// 防止重复请求
export default (options = {}) => async config => {
  const defaultOptions = {
    time: 0, // 设置为0，不清除缓存
    ...options
  }
  const index = buildUniqueUrl(config.url, config.method, config.params, config.data)
  let responsePromise = cache.get(index)
  if (!responsePromise) {
    responsePromise = (async () => {
      try {
        const response = await request.defaults.adapter(config)
        return Promise.resolve(response)
      } catch (reason) {
        cache.clear(index)
        return Promise.reject(reason)
      }
    })()
    cache.set(index, responsePromise)
    if (defaultOptions.time !== 0) {
      setTimeout(() => {
        cache.clear(index)
      }, defaultOptions.time)
    }
  }
  return responsePromise.then(data => JSON.parse(JSON.stringify(data))) // 为防止数据源污染
}