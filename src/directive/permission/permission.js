import store from '@/store'
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const perms = store.getters && store.state.user.perms

    if (value && value instanceof Array && value.length > 0) {
      const permissionPerms = value

      const hasPermission = perms.some(role => {
        return permissionPerms.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissions! Like v-perms="['add','edit']"`)
    }
  }
}
