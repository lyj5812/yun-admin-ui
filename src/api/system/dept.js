import request from '@/utils/request'

export function deptList() {
  return request({
    url: '/admin-server/dept/deptTreeList',
    method: 'get'
  })
}

export function deptAddOrEdit(data) {
  return request({
    url: '/admin-server/dept/deptAddOrEdit',
    method: 'put',
    data
  })
}

export function delDept(data) {
  return request({
    url: '/admin-server/dept/delDept',
    method: 'delete',
    data
  })
}
