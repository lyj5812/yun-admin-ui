import { constantRoutes } from '@/router'
import Layout from '@/layout'
import store from '@/store'

// 遍历路由，转换组件对象
function filterAsyncRouter(menu, routers) {
  menu.forEach(route => {
    if (route.component && !route.children) {
      // Layout组件特殊处理
      delete route['name']
      if (route.iframe) {
        const iframe = { 'path': route.path, 'url': route.component }
        store.commit('addIFrameUrl', iframe)
        route.component = require('@/layout/Components/IFrame.vue').default
      } else {
        try {
          route.component = require(`@/views${route.component}`).default
        } catch (e) {
          route.component = require(`@/views/error-page/404.vue`).default
          console.log(e.message)
        }
      }
      const tempRoute = {
        path: '/',
        component: Layout,
        meta: route.meta,
        children: [route]
      }
      routers.push(tempRoute)
    } else {
      delete route['path']
    }
    if (route.children) {
      route.children = filterAsyncRouter(route.children, routers)
    }
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
      const tempMenus = JSON.parse(JSON.stringify(menus))
      const routers = []
      filterAsyncRouter(menus, routers)
      commit('SET_ROUTES', tempMenus)
      resolve(routers)
    })
  }
}

const getters = {
  routes: state => state.routes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
