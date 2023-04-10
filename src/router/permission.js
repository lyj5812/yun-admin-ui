import router from '@/router'
import { getToken } from '@/utils/auth'
import store from '@/store'
const whiteList = ['/login', '/auth-redirect', '/wb_4a1b8db989bb74d4.txt']// 路由白名单
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 设置页面 title
  document.title = to.name || 'yun-admin'
  // 已登录
  if (getToken()) {
    if (to.path === '/login') {
      // 已登录跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确认用户已有角色
      const hasRoles = store.state.user.roles && store.state.user.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          // 获取用户菜单
          const menus = await store.dispatch('user/getMenu')
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
          NProgress.done()
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
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
