const localStorage = require('localStorage')

const set = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value))
}

const get = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

/**
 * 设置值带过期时间
 * @param key
 * @param value
 * @param time 过期时间(毫秒)
 */
const setExpired = (key, value, time) => {
  const curTime = new Date().getTime()
  localStorage.setItem(key, JSON.stringify({ data: value, time: curTime, expTime: time }))
}

/**
 * 获取过期时间的值
 * @param key
 * @returns {boolean|*}
 */
const getExpired = (key) => {
  const data = JSON.parse(localStorage.getItem(key))
  if (!data || (new Date().getTime() - data.time > data.expTime)) {
    // 过期
    localStorage.removeItem(key)
    return null
  } else {
    return data.data
  }
}

const remove = (key) => {
  return localStorage.removeItem(key)
}

export default {
  set,
  get,
  setExpired,
  getExpired,
  remove
}
