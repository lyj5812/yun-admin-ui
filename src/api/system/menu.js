import request from '@/utils/request'

export function menuList() {
  return request({
    url: '/admin-server/menu/menuList',
    method: 'get'
  })
}

export function menuAddOrEdit(data) {
  return request({
    url: '/admin-server/menu/menuAddOrEdit',
    method: 'put',
    data
  })
}

export function delMenu(data) {
  return request({
    url: '/admin-server/menu/delMenu',
    method: 'delete',
    data
  })
}
