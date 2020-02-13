import request from '@/utils/request'

export function roleListPage(data) {
  return request({
    url: '/admin-server/role/roleListPage',
    method: 'get',
    params: data
  })
}

export function addOrEdit(data) {
  return request({
    url: '/admin-server/role/addOrEdit',
    method: 'post',
    data
  })
}

export function delList(data) {
  return request({
    url: '/admin-server/role/delByIds',
    method: 'delete',
    data
  })
}

export function roleList() {
  return request({
    url: '/admin-server/role/getRoleList',
    method: 'get'
  })
}

export function menuIdsByRoleId(roleId) {
  return request({
    url: '/admin-server/role/menuIdsByRoleId',
    method: 'get',
    params: { roleId }
  })
}
