/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2020-06-24 16:46:45
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2020-07-24 10:28:10
 * @Description: file content
 */
import store from "@/store"
import * as types from '@/store/Getter/getterTypes'

export function setUserData(data) {
  data[types.USER_NAME] = store.getters[types.USER_NAME]
  data[types.USER_FULLNAME] = store.getters[types.USER_FULLNAME]
  data[types.PRJ_DEP_CODE] = store.getters[types.PRJ_DEP_CODE]
  data[types.PRJ_DEP_NAME] = store.getters[types.PRJ_DEP_NAME]
  data[types.USER_TELPHONE_NUM] = store.getters[types.USER_TELPHONE_NUM]
  if (!data.prjName && data.preSaveValidate) {
    data.prjId = store.state.organization.indexId
    data.prjName = store.state.organization.indexHome
  }
}
