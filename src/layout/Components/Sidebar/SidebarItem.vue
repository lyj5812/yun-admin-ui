<template>
  <div v-if="!item.hidden">
    <div
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
      class="ys--item"
    >
      <router-link :to="item.path" class="ys--link" :class="[active?'ys--link_active':'']">
        <v-icon :class="['ml-'+level*2]" class="ys--icon" v-text="item.meta.icon" />
        <span v-if="!isCollapsed" class="ys--title">
          {{ item.meta.title }}
        </span>
      </router-link>
    </div>
    <div
      v-else
      class="ys--item ys--item_open"
    >
      <div class="ys--link" :class="[open?'ys--link_group_open':'',groupActive?'ys--link_active':'']" @click="open=!open">
        <v-icon :class="['ml-'+level*2]" class="ys--icon" v-text="item.meta.icon" />
        <span v-if="!isCollapsed" class="ys--title">{{ item.meta.title }}</span>
        <div
          v-if="!isCollapsed"
          class="ys--arrow"
          :class="[{'ys--arrow_open' : open}, {'vsm--arrow_slot' : $slots['dropdown-icon']}]"
        >
          <slot name="dropdown-icon" />
        </div>
      </div>

      <transition
        name="expand"
        @enter="expandEnter"
        @afterEnter="expandAfterEnter"
        @beforeLeave="expandBeforeLeave"
      >
        <div v-show="open">
          <sidebar-item
            v-for="child in item.children"
            :key="child.path"
            :level="level+1"
            :item="child"
            :is-collapsed="isCollapsed"
          />
        </div>
      </transition>
      <div />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 1
    },
    isCollapsed: {
      type: Boolean
    },
    isMobileItem: {
      type: Boolean,
      default: false
    },
    mobileItem: {
      type: Object,
      default: null
    },
    activeShow: {
      type: Object,
      default: null
    },
    showChild: {
      type: Boolean,
      default: false
    },
    showOneChild: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.onlyOneChild = null
    return {
      open: false,
      active: false,
      groupActive: false
    }
  },
  watch: {
    $route() {
      this.initState()
    },
    isCollapsed() {
      this.initMobile()
      this.initState()
    }
  },
  created() {
    this.initState()
  },
  methods: {
    initState() {
      this.active = this.isLinkActive(this.item)
      this.open = this.active
      this.initMobile()
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    isLinkActive(item) {
      return this.matchRoute(item) || this.isChildActive(item.children) || this.isAliasActive(item)
    },
    matchRoute({ path, exactPath }) {
      if (!path) return false
      if (this.$router) {
        const { route } = this.$router.resolve(path)
        return exactPath ? route.path === this.$route.path : this.matchExactRoute(path)
      } else {
        return exactPath ? path === window.location.pathname : this.matchExactRoute(path)
      }
    },
    isChildActive(child) {
      if (!child) return false
      return child.some(item => {
        return this.isLinkActive(item)
      })
    },
    isAliasActive(item) {
      if (item.alias) {
        if (Array.isArray(item.alias)) {
          return item.alias.some(alias => {
            return this.matchExactRoute(alias)
          })
        } else {
          return this.matchExactRoute(item.alias)
        }
      }
      return false
    },
    matchExactRoute(path) {
      if (!path) return false
      if (this.$router) {
        const { route } = this.$router.resolve(path)
        return route.fullPath === this.$route.fullPath
      } else {
        return path === window.location.pathname + window.location.search + window.location.hash
      }
    },
    initMobile() {
      if (this.level === 1 && this.isCollapsed) {
        if (this.open) {
          this.groupActive = true
        }
        this.open = false
      } else if (this.level === 1 && this.groupActive && !this.isCollapsed) {
        this.open = true
        this.groupActive = false
      }
    },
    expandEnter(el) {
      el.style.height = el.scrollHeight + 'px'
    },
    expandAfterEnter(el) {
      el.style.height = 'auto'
    },
    expandBeforeLeave(el) {
      if (this.isCollapsed && (this.level === 1 || this.level === undefined)) {
        el.style.display = 'none'
        return
      }
      el.style.height = el.scrollHeight + 'px'
    }
  }
}
</script>
