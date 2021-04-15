/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-01 16:46:37
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-04-21 10:46:00
 * @Description: 各模块入口文件注册公用属性
 */
import { LANG } from '@/store/State/stateTypes'
import { mapMutations } from 'vuex'
import { SET_LANG } from '@/store/Mutation/mutationTypes'
import deepmerge from 'deepmerge'
export default {
  provide() {
    return {
      MODULE: this.$options.name, //向子组件传递多语言模块名称
      lan: () => this.LANG
    }
  },
  computed: {
    LANG() {
      return deepmerge(this.lan() || {}, this.$store.state[LANG][this.$options.name] || {}, { clone: true })  //注册模块的入口文件中，覆盖全局LANG,指向当前模块
    }
  },
  methods: {
    ...mapMutations({
      'SET_LANG': SET_LANG,
    }),
    //读取本地语言资源
    loadLocaleLang() {
      if (this.$store.state[LANG][this.$options.name]) {
        return false
      }
      const name = this.$options.name
      try {
        let LOCAL_LANG
        if (name == 'Global') {
          LOCAL_LANG = require('@/lang')
        } else {
          let path = this.$options.__source && this.$options.__source.replace(/(.*)\/{1}.*/, '$1').replace('src/', '')
          LOCAL_LANG = require(`@/${path}/lang.js`)
        }
        if (LOCAL_LANG.default) {
          // localStorage.setItem('LANG', JSON.stringify(Object.assign({ ...STORAGE_LANG }, { [name]: LOCAL_LANG.default })))
          this.SET_LANG({ key: name, value: LOCAL_LANG.default })
        }
      } catch (e) {
        console.log(e.toString())
      }
    }
  },
  created() {
    this.loadLocaleLang() //有限获取本地资源
  }
}