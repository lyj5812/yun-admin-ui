import store from '@/utils/localStorage'

const TokenKey = 'Admin-Token'

export function getToken() {
  return store.getExpired(TokenKey)
}

export function setToken(token, time) {
  return store.setExpired(TokenKey, token, time)
}

export function removeToken() {
  return store.remove(TokenKey)
}
