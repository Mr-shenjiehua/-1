/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-28 10:42:58
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-10-10 11:22:37
 * @Description:  全局过滤器
 */
import VueI18n from 'vue-i18n'
import FawkesLib from 'fawkes-lib' //组件库
import { Svg } from 'fawkes-lib'
import mavonEditor from 'mavon-editor'
import { SvgIcon } from '@/components'

// import 'fawkes-lib/lib/fawkes.css'
import 'fawkes-lib/lib/theme-chalk/index.css'

import enLocale from 'fawkes-lib/src/locale/lang/en'
import zhLocale from 'fawkes-lib/src/locale/lang/zh-CN'

import store from '@/store'
import { ENUM } from '@/store/State/stateTypes'

import { nodePermission } from '@/permission'

import request from '@/utils/request' //axios封装
//import VueSocketIO from '@/utils/socket.js' // 引入vue-socket-io
import { getLangConfig } from '@/utils/util'

import mixin from '@/mixins/default' //全局混入
import storage from './storage'
import settings from '@/settings'



const plugins = {}
plugins.install = function (Vue) {

  //elementUi多语言切换
  Vue.use(VueI18n)
  Vue.config.lang = getLangConfig()
  Vue.locale('zh', zhLocale)
  Vue.locale('en', enLocale)
  Vue.mixin(mixin)
  //console.log(store.state[INTERFACE_CONFIG])
  //fawkes组件库
  Vue.use(FawkesLib, {
    prefix: settings.prefix,
    request: request,
    locale: Vue.locale(getLangConfig())
  })

  Vue.use(mavonEditor)

  Vue.component('svg-icon', settings.localSvg ? SvgIcon : Svg) //在线svg组件注册，本地模块可改为离线svg组件

  if (settings.localSvg) {
    const req = require.context('@/assets/svg', false, /\.svg$/)
    const requireAll = requireContext => requireContext.keys().map(requireContext)
    requireAll(req)
  }

  Vue.filter('transferEnum', function (value, enumName) {
    if (!store.state[ENUM][enumName]) {
      return value
    }
    let obj = store.state[ENUM][enumName].find(i => {
      return i.code == value
    })
    if (!obj) {
      return value
    }
    return obj[getLangConfig()]
  })


  Vue.prototype.$axios = request
  Vue.prototype.nodePermission = nodePermission
  Vue.prototype.$storage = storage
}
export default plugins