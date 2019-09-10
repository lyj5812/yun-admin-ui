import localStorage from '@/utils/localStorage'

const TokenKey = 'Admin-Token'

export function getToken() {
  return localStorage.getExpired(TokenKey)
}

export function setToken(token, time) {
  return localStorage.setExpired(TokenKey, token, time)
}

export function removeToken() {
  return localStorage.remove(TokenKey)
}
