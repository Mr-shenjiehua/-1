/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2019-11-09 14:28:02
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2019-11-23 16:20:06
 * @Description: 使用element暴露的工具类
 */

/**
 * 引入
 *
  import {
    addResizeListener,
    removeResizeListener
  } from 'fawkes-lib/src/utils/resize-event'
 */

/**
 * 使用
 *
  mounted() {
  this.$nextTick(() => {
    this.handleResize()
    addResizeListener(this.$el, this.handleResize)
  })
  },
  beforeDestroy() {
    if (this.$el) removeResizeListener(this.$el, this.handleResize)
  }
 */