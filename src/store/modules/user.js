import { login, logout, getUserInfo } from '@/api/login'
import { getMenus } from '@/api/system/menu'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  user: {},
  roles: [],
  perms: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(username.trim(), password).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token, data.expires_in * 1000)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const data = response.data.data
        if (!data) {
          reject('error')
        }
        const { roleKeys, sysUser, perms } = data
        if (roleKeys && roleKeys.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', roleKeys)
        }

        if (perms && perms.length > 0) { // permissions是否是一个非空数组
          commit('SET_PERMS', perms)
        }

        commit('SET_USER', sysUser)
        resolve(roleKeys)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户菜单
  getMenu() {
    return new Promise((resolve, reject) => {
      getMenus().then(response => {
        const data = response.data.data
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

const getters = {
  token: state => state.token,
  user: state => state.user,
  roles: state => state.roles,
  perms: state => state.perms
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
