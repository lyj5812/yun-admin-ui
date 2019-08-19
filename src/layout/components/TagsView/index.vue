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
          <v-list-item @click="refreshSelectedTag(selectedTag)">
            <v-list-item-title>刷新</v-list-item-title>
          </v-list-item>
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
import { generateTitle } from '@/utils/i18n'
import { mapGetters } from 'vuex'
import path from 'path'

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
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    },
    ...mapGetters({
      toolColor: 'app/toolColor'
    })
  },
  watch: {
    $route() {
      this.addTags()
    }
  },
  mounted() {
    this.initTags()
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
    generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
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
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (!view) {
          this.$router.push('/')
        } else if (view.name === 'Dashboard') {
          // to reload home page
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
