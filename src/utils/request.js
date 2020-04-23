import axios from 'axios'
import store from '@/store'
import Message from '@/components/Message'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.state.user.token && config.url !== '/auth-server/oauth/token') {
      // 让每个请求携带token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + store.state.user.token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  res => {
    if (res.status !== 200) {
      const msg = res.data.msg
      Message.error(msg)
      return Promise.reject(new Error(msg))
    } else if (res.data.code && res.data.code === 401) {
      const msg = res.data.msg
      Message.error('登录过期，请重新登录！')
      store.dispatch('user/logout').then(() => {
        location.reload() // 重新实例化vue-router对象
      })
      return Promise.reject(new Error(msg))
    } else if (res.data.code && res.data.code !== 200) {
      const msg = res.data.msg
      Message.error(msg)
      return Promise.reject(new Error(msg))
    } else {
      return res
    }
  },
  error => {
    console.log(error.response) // for debug
    if (error.response.status === 401) {
      Message.error('登录过期，请重新登录！')
      store.dispatch('user/logout').then(() => {
        location.reload() // 重新实例化vue-router对象
      })
    } else {
      Message.error(error.response.data.error || error.response.data.msg)
      return Promise.reject(error)
    }
  }
)

export default service
