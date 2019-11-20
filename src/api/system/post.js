import request from '@/utils/request'

export function postList() {
  return request({
    url: '/admin-server/post/getPostList',
    method: 'get'
  })
}

export function postListPage(data) {
  return request({
    url: '/admin-server/post/postListPage',
    method: 'get',
    params: data
  })
}

export function addOrEdit(data) {
  return request({
    url: '/admin-server/post/addOrEdit',
    method: 'put',
    data
  })
}

export function deleteList(data) {
  return request({
    url: '/admin-server/post/deleteList',
    method: 'delete',
    data
  })
}
