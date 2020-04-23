const storage = window.localStorage
const sessionStorage = window.sessionStorage

/**
 * set localStorage
 * @param {string} key
 * @param {string} value
 */
export function setLS(key, value) {
  storage.setItem(key, JSON.stringify(value))
}

/**
 * set sessionStorage
 * @param {string} key
 * @param {string} value
 */
export function setSS(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

/**
 * get localStorage
 * @param {string} key
 * @return {Object} value
 */
export function getLS(key) {
  return JSON.parse(storage.getItem(key))
}

/**
 * get sessionStorage
 * @return {Object} key
 */
export function getSS(key, value) {
  return JSON.parse(sessionStorage.getItem(key))
}

/**
 * 设置值带过期时间
 * @param key
 * @param value
 * @param time 过期时间(毫秒)
 */
export function setLSExpired(key, value, time) {
  const curTime = new Date().getTime()
  storage.setItem(key, JSON.stringify({ data: value, time: curTime, expTime: time }))
}

/**
 * 设置值带过期时间
 * @param key
 * @param value
 * @param time 过期时间(毫秒)
 */
export function setSSExpired(key, value, time) {
  const curTime = new Date().getTime()
  sessionStorage.setItem(key, JSON.stringify({ data: value, time: curTime, expTime: time }))
}

/**
 * 获取过期时间的值
 * @param key
 * @returns {boolean|*}
 */
export function getLSExpired(key) {
  const data = JSON.parse(storage.getItem(key))
  if (!data || (new Date().getTime() - data.time > data.expTime)) {
    // 过期
    storage.removeItem(key)
    return null
  } else {
    return data.data
  }
}

/**
 * 获取过期时间的值
 * @param key
 * @returns {boolean|*}
 */
export function getSSExpired(key) {
  const data = JSON.parse(sessionStorage.getItem(key))
  if (!data || (new Date().getTime() - data.time > data.expTime)) {
    // 过期
    sessionStorage.removeItem(key)
    return null
  } else {
    return data.data
  }
}

export function removeLS(key) {
  storage.removeItem(key)
}

export function removeSS(key) {
  sessionStorage.removeItem(key)
}

export function clearLS() {
  storage.clear()
}

export function clearSS() {
  sessionStorage.clear()
}
