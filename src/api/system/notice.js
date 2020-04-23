import request from '@/utils/request'

export function noticeListPage(data) {
  return request({
    url: '/admin-server/notice/listPage',
    method: 'get',
    params: data
  })
}

export function addOrEdit(data) {
  return request({
    url: '/admin-server/notice/addOrEdit',
    method: 'put',
    data
  })
}

export function delList(data) {
  return request({
    url: '/admin-server/notice/delByIds',
    method: 'delete',
    data
  })
}
