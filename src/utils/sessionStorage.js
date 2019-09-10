const sessionStorage = window.sessionStorage

const set = (key, value) => {
  return sessionStorage.setItem(key, JSON.stringify(value))
}

const get = (key) => {
  return JSON.parse(sessionStorage.getItem(key))
}

/**
 * 设置值带过期时间
 * @param key
 * @param value
 * @param time 过期时间(毫秒)
 */
const setExpired = (key, value, time) => {
  const curTime = new Date().getTime()
  sessionStorage.setItem(key, JSON.stringify({ data: value, time: curTime, expTime: time }))
}

/**
 * 获取过期时间的值
 * @param key
 * @returns {boolean|*}
 */
const getExpired = (key) => {
  const data = JSON.parse(sessionStorage.getItem(key))
  if (!data || (new Date().getTime() - data.time > data.expTime)) {
    // 过期
    sessionStorage.removeItem(key)
    return null
  } else {
    return data.data
  }
}

const remove = (key) => {
  return sessionStorage.removeItem(key)
}

const clear = () => {
  return sessionStorage.clear()
}
export default {
  set,
  get,
  setExpired,
  getExpired,
  remove,
  clear
}
