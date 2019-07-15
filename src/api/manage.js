import { axios } from '@/utils/request'
import { ManageAPI } from './index'

export function getUserList (parameter) {
  return axios({
    url: ManageAPI.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: ManageAPI.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: ManageAPI.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: ManageAPI.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: ManageAPI.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: ManageAPI.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
