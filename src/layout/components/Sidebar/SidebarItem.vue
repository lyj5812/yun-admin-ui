<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!--无子菜单-->
      <v-list-item v-if="onlyOneChild.meta" active-class="box-glow" :to="resolvePath(onlyOneChild.path)">
        <v-list-item-icon>
          <v-icon size="18" class="mt-1">{{ item.meta.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </template>
    <!--有子菜单-->
    <v-list-group
      v-else
      :group="item.path"
      :prepend-icon="item.meta.icon"
      class="menu-group"
      no-action
      :active-class="navColor.dark||$vuetify.theme.dark?'nav-white-active':'nav-black-active'"
    >
      <template #activator>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </v-list-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils/validate'
export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  computed: {
    ...mapGetters({
      navColor: 'app/navColor'
    })
  },
  methods: {
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
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="css" scoped>
    .menu-group >>> .v-list-group__header__prepend-icon .v-icon{
        height: .7em !important;
        width: .7em !important;
        margin-top: .2em;
    }

    .menu-group >>> .v-list-group__header__prepend-icon i{
        font-size: 1.1em;
        margin-left: .2em;
        margin-top: .4em;
    }
</style>
