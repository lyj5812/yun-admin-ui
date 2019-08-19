import permission from './permission'

const install = function(Vue) {
  Vue.directive('perms', permission)
}

if (window.Vue) {
  window['perms'] = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
