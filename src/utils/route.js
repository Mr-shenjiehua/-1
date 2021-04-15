/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2020-08-27 20:29:37
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-09-13 12:24:31
 * @Description: 权限相关方法
 */
import { resetRouter, setRoutes } from '@/router'
import { getRouter } from '@/api/user'
import { transTree } from '@/utils/util'

/**
 * @description: 加载本地路由
 * @param {type} 
 * @return {type} 
 */
export const getLocalRoutes = function (router) {
  resetRouter()
  const reqs = require.context('@/modules', true, /route\.js$/)
  let analysis = function (req, p) {
    let reg = new RegExp('^' + p.replace('/route.js', '') + '\/[a-zA-Z]+\/route\.js$')
    reqs.keys().forEach((dpath) => {
      if (reg.test(dpath)) {
        let cReq = require(`@/modules/${dpath.replace('./', '')}`).default
        if (req.children) {
          req.children.push(cReq)
        } else {
          req.children = [cReq]
        }
        analysis(cReq, dpath)
      }
    })
  }
  reqs.keys().forEach((path) => {
    if (/^\.\/[a-zA-Z]+\/route\.js$/.test(path)) {
      let req = require(`@/modules/${path.replace('./', '')}`).default
      analysis(req, path)
      if (path.includes('Home')) {
        router.options.routes.unshift(req)
      } else {
        router.options.routes.push(req)
      }
    }
  })
  router.options.routes.push({ path: '*', redirect: '/403', hidden: true })
  router.addRoutes(router.options.routes)
}

/**
 * @description: 加载线上路由
 * @param {type} 
 * @return {type} 
 */
export const getUserRoutes = function (router) {
  return new Promise((resolve, reject) => {
    let _baseRoutes = []
    getRouter().then(res => {
      if (res.status && res.data) {
        const tree = []
        for (let i = 0; i < res.data.length; i++) {
          const menuItem = { ...res.data[i] }
          menuItem.component = () => import('@/modules' + res.data[i].component)
          menuItem.name = res.data[i].code
          menuItem.hidden = !res.data[i].hidden ? false : true
          menuItem.path || (menuItem.path = '')
          menuItem.meta = res.data[i] && JSON.parse(res.data[i].meta) || {}
          menuItem.meta.id = res.data[i].id
          tree.push(menuItem)
        }
        tree.sort((v1, v2) => {
          return v1.sort === null ? v2.sort + 1 : (v2.sort === null ? -v1.sort - 1 : v1.sort - v2.sort)
        })
        // 解析为带children树结构的格式，treeData为最终的树结构
        let treeData = transTree(tree, 'id', 'parentId').val
        _baseRoutes = _baseRoutes.concat(treeData)
      }
      setRoutes([..._baseRoutes, { path: '*', redirect: '/403', hidden: true }])
      resolve(true)
    }).catch((e) => {
      setRoutes([{ path: '*', redirect: '/403', hidden: true }])
      resolve(true)
    })
  })
}

