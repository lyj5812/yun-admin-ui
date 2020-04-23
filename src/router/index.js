import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    meta: { title: '首页', icon: 'mdi-home-circle', noCache: true, affix: true },
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/dictData/:dictType(\\w+)',
        component: () => import('@/views/system/dict/data'),
        name: '字典数据',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/gen/:sourceId(\\w+)/:tableName(\\w+)',
        component: () => import('@/views/tool/gen/eidt'),
        name: '修改代码生成',
        meta: { title: '修改代码生成', icon: '' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
