<template>
  <v-layout row pl-3>
    <v-flex lg12>
      <v-card flat tile :class="[$vuetify.theme.dark?'':'white']">
        <v-chip-group
          show-arrows
          active-class="primary--text"
          class="pl-2"
        >
          <v-chip
            v-for="tag in visitedViews"
            :key="tag.path"
            color="primary"
            outlined
            label
            :value="tag"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            @contextmenu="show"
            @contextmenu.prevent="selected(tag)"
          >
            {{ tag.title }}
            <v-btn fab x-small class="ml-2" icon @click.stop.prevent="closeSelectedTag(tag)">
              <v-icon dark small>mdi-close-circle</v-icon>
            </v-btn>
          </v-chip>
        </v-chip-group>
      </v-card>
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        transition="scale-transition"
        offset-y
      >
        <v-list dense>
          <v-list-item @click="closeSelectedTag(selectedTag)">
            <v-list-item-title>关闭</v-list-item-title>
          </v-list-item>
          <v-list-item @click="closeOthersTags()">
            <v-list-item-title>关闭其他</v-list-item-title>
          </v-list-item>
          <v-list-item @click="closeAllTags()">
            <v-list-item-title>关闭所有</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-flex>
  </v-layout>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      visible: false,
      tab: null,
      showMenu: false,
      x: 0,
      y: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    ...mapGetters({
      toolColor: 'app/toolColor',
      visitedViews: 'tagsView/visitedViews'
    })
  },
  watch: {
    $route() {
      this.addTags()
    }
  },
  mounted() {
    this.addTags()
  },
  methods: {
    show(e) {
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
    selected(tag) {
      this.selectedTag = tag
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // 默认重定向首页
        if (!view) {
          this.$router.push('/')
        } else if (view.name === '首页') {
          // 重新加载首页
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    }
  }
}
</script>
<style scoped>
  .mytabs >>> .v-btn.v-btn--icon, .v-toolbar__extension .v-btn.v-btn--icon {
    height: auto;
    width: auto;
  }

</style>
