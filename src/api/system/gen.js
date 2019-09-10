import request from '@/utils/request'

export function linkDB(data) {
  return request({
    url: '/gen-server/linkDB',
    method: 'post',
    data
  })
}
