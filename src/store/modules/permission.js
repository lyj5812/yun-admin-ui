import { constantRoutes } from '@/router'
import Layout from '@/layout'
import { validateURL } from '@/utils/validate'
import store from '@/store'
const importVue = require('../../router/import') // 获取组件的方法

/**
 * 递归过滤异步路由表
 * @param menus
 */
function filterAsyncRouter(menus, routers) {
  menus.forEach(menu => {
    if (menu.hasOwnProperty('children')) {
      filterAsyncRouter(menu.children, routers)
    } else {
      const temp = {}
      temp.path = menu.path
      if (validateURL(menu.component)) {
        temp.component = require('@/layout/components/IFrame.vue').default
        const iframe = { 'path': menu.path, 'url': menu.component }
        store.commit('addIFrameUrl', iframe)
      } else {
        temp.component = importVue(menu.component)
      }
      temp.name = menu.name
      temp.icon = menu.icon
      routers.push(temp)
    }
  })
}

const state = {
  routes: [],
  menus: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    routes.push({ path: '*', redirect: '/404', hidden: true })
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENUS: (state, menus) => {
    const temp = []
    constantRoutes.forEach(route => {
      if (!route.hidden) {
        route.children.forEach(childRoute => {
          temp.push(childRoute)
        })
      }
    })
    state.menus = temp.concat(menus)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      commit('SET_MENUS', menus)
      const routers = [{
        path: '/',
        component: Layout,
        children: []
      }]
      filterAsyncRouter(menus, routers[0].children)
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
