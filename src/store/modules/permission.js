import { constantRoutes } from '@/router'
import Layout from '@/layout'
import store from '@/store'

// 遍历路由，转换组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.iframe) {
        const iframe = { 'path': route.path, 'url': route.component }
        store.commit('addIFrameUrl', iframe)
        route.component = require('@/layout/components/IFrame.vue').default
      } else {
        try {
          route.component = require(`@/views${route.component}`).default
        } catch (e) {
          route.component = require(`@/views/error-page/404.vue`).default
          console.log(e.message)
        }
      }
    }
    if (route.children) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    routes.push({ path: '*', redirect: '/404', hidden: true })
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const routers = filterAsyncRouter(menus)
      commit('SET_ROUTES', routers)
      resolve(routers)
    })
  }
}

const getters = {
  menus: state => state.menus
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
