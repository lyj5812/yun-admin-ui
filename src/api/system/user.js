import request from '@/utils/request'

export function userListPage(data) {
  return request({
    url: '/admin-server/user/userListPage',
    method: 'get',
    params: data
  })
}

export function userAddOrEdit(data) {
  return request({
    url: '/admin-server/user/userAddOrEdit',
    method: 'put',
    data
  })
}

export function deleteList(data) {
  return request({
    url: '/admin-server/user/deleteList',
    method: 'delete',
    data
  })
}

export function getRoleIdsAndPostIdsAndDeptByUserId(userId) {
  return request({
    url: '/admin-server/user/roleIdsAndPostIdsAndDeptByUserId/' + userId,
    method: 'get'
  })
}

export function checkUsername(username) {
  return request({
    url: '/admin-server/user/checkUsername/' + username,
    method: 'get'
  })
}

export function editPwd(data) {
  return request({
    url: '/admin-server/user/editPwd',
    method: 'put',
    params: data
  })
}

export function userEdit(data) {
  return request({
    url: '/admin-server/user/edit',
    method: 'put',
    data
  })
}
