import router from './router'
import { getToken } from './utils/auth'
import store from './store'
const whiteList = ['/login', '/auth-redirect']// 路由白名单

router.beforeEach(async(to, from, next) => {
  // 设置页面 title
  document.title = to.name || 'yun-admin'
  // 已登录
  if (getToken()) {
    if (to.path === '/login') {
      // 已登录跳转到首页
      next({ path: '/' })
    } else {
      // 确认用户已有角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 获取用户菜单
          const { menus } = await store.dispatch('user/getInfo')
          // 生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
          // 动态添加菜单
          router.addRoutes(accessRoutes)
          // 设置replace 不保存历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除token 重定向到登录
          console.log(error)
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* 没有token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 跳转到白名单
      next()
    } else {
      // 没有权限跳转到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})
