import request from '@/utils/request'

export function getMenus() {
  return request({
    url: '/admin-server/menu',
    method: 'get'
  })
}

export function menuList() {
  return request({
    url: '/admin-server/menu/menuList',
    method: 'get'
  })
}

export function getMenuById(menuId) {
  return request({
    url: '/admin-server/menu/getMenuById/' + menuId,
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
