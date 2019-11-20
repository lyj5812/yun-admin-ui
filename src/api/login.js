import request from '@/utils/request'

export function login(username, password) {
  const grant_type = 'password'
  return request({
    url: '/auth-server/oauth/token',
    headers: {
      'Authorization': 'Basic YWRtaW46MTIzNDU2'
    },
    method: 'post',
    params: { username, password, grant_type }
  })
}

export function logout(data) {
  return request({
    url: '/auth-server/user/logout',
    method: 'delete',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/admin-server/user/info',
    method: 'get'
  })
}

