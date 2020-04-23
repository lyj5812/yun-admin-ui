import { getLSExpired, setLSExpired, removeLS } from '@/utils/storage'

const TokenKey = 'Admin-Token'

export function getToken() {
  return getLSExpired(TokenKey)
}

export function setToken(token, time) {
  return setLSExpired(TokenKey, token, time)
}

export function removeToken() {
  return removeLS(TokenKey)
}
