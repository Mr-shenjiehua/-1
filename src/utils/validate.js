/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-05 14:32:05
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2019-11-25 14:06:49
 * @Description: 正则校验集合
 */

/**
 * @description 校验外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description: 匹配HEX格式颜色码
 * @param {string} str
 * @return {Boolean}
 */
export function validateColor(str) {
  const reg = /^#[0-9a-fA-F]{6}$/
  return reg.test(str)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}