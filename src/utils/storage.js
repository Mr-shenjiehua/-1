/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2020-04-29 09:54:06
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-04-29 15:42:00
 * @Description: 封装 storage类
 */
import { prefix } from '@/settings'
export default {
  /**
 * @description: localStorage存储封装
 * @param {String} name
 * @param {String} value
 * @return: void
 */
  set: (name, value) => {
    localStorage.setItem(prefix + name, value)
  },

  /**
   * @description: localStorage获取封装
   * @param {String} name
   * @return: String
   */
  get: (name) => {
    return localStorage.getItem(prefix + name)
  },

  /**
   * @description: localStorage移除封装
   * @param {String} name
   * @param {String} value
   * @return: void
   */
  remove: (name, value) => {
    localStorage.removeItem(prefix + name, value)
  },

  /**
   * @description: localStorage清空封装
   * @param {String} name
   * @return: String
   */
  clear: () => {
    let len = localStorage.length
    let keys = []

    for (let i = 0; i < len; i++) {
      let key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keys.push(key)
      }
    }

    keys.map(key => localStorage.removeItem(key))
  }
}