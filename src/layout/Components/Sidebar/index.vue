<template>
  <div
    class="yun-sidebar bg-img4"
    :class="[collapsed?'ys_collapsed':'ys_expanded',$vuetify.theme.dark?'':navColor.class]"
    :style="[{'max-width': sidebarWidth}]"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
    <div class="ys--header">
      <img src="../../../assets/img/logo.svg">
      <span v-if="!collapsed">
        YUN-ADMIN
      </span>
    </div>
    <div>
      <sidebar-item v-for="(route,index) in menus" :key="index" :is-collapsed="collapsed" :item="route" />
    </div>
  </div>
</template>
<script>
import SidebarItem from './SidebarItem.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  props: {
    width: {
      type: String,
      default: '250px'
    },
    collapsed: {
      type: Boolean,
      default: true
    },
    test11: {
      type: Boolean,
      default: false
    },
    widthCollapsed: {
      type: String,
      default: '60px'
    },
    theme: {
      type: String,
      default: ''
    }
  },
  computed: {
    sidebarWidth() {
      return this.collapsed ? this.widthCollapsed : this.width
    },
    ...mapGetters({
      sidebarMini: 'app/sidebarMini',
      navColor: 'app/navColor',
      menus: 'permission/routes',
      sidebarDrawer: 'app/sidebarDrawer',
      sidebarMobile: 'app/sidebarMobile'
    })
  },
  methods: {
    mouseEnter() {
      this.$emit('sidebarEnter')
    },
    mouseLeave() {
      this.$emit('sidebarLeave')
    }
  }
}
</script>

<style scoped>

</style>
