<template>
  <div>
    <Sidebar
      :class="[screenWidth<=500?'mobile':'',sidebarShow?'drawer':'']"
      :collapsed="isCollapsed"
      @sidebarEnter="mouseEnter"
      @sidebarLeave="mouseLeave"
    />
    <navbars :style="{marginLeft:sidebarWidth}" class="aaa" @clickNavIcon="clickNavIcon" />
    <div :style="{marginLeft:sidebarWidth}" class="aaa">

      <v-content>
        <app-main />
      </v-content>
    </div>
    <app-settings />
  </div>
</template>

<script>
import Sidebar from '@/layout/Components/Sidebar'
import Navbars from '@/layout/Components/Navbars'
import AppMain from '@/layout/Components/AppMain'
import AppSettings from './Components/AppSettings'
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain,
    Navbars,
    AppSettings
  },
  data() {
    return {
      collapsed: true,
      sidebarWidth: '250px',
      sidebarShow: false,
      screenWidth: document.body.clientWidth// 屏幕宽度
    }
  },
  computed: {
    isCollapsed: {
      get() {
        return (this.sidebarMini || this.sidebarDrawer) && !this.sidebarShow
      },
      set(value) {
        return value
      }
    },
    ...mapGetters({
      sidebarDrawer: 'app/sidebarDrawer',
      sidebarMini: 'app/sidebarMini'
    })
  },
  watch: {
    screenWidth(val) {
      this.setCollapsed(val)
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  created() {
    this.setCollapsed(document.body.clientWidth)
  },
  methods: {
    setCollapsed(width) {
      this.screenWidth = width
      if (width > 900) {
        this.$store.dispatch('app/setSidebarMini', false)
        if (!this.sidebarDrawer) {
          this.sidebarWidth = '250px'
        } else {
          this.sidebarWidth = '60px'
        }
      } else if (width > 500 && width <= 900) {
        this.$store.dispatch('app/setSidebarMini', true)
        this.sidebarWidth = '60px'
      } else {
        this.sidebarWidth = '0px'
      }
    },
    clickNavIcon() {
      if (this.screenWidth > 900) {
        this.$store.dispatch('app/setSidebarDrawer', !this.$store.state.app.sidebarDrawer)
        if (this.sidebarDrawer) {
          this.sidebarWidth = '60px'
        } else {
          this.sidebarWidth = '250px'
        }
      } else if (this.screenWidth <= 500) {
        this.sidebarShow = true
      }
    },
    mouseEnter() {
      if (this.screenWidth <= 900 || this.sidebarDrawer) {
        this.sidebarShow = true
      }
    },
    mouseLeave() {
      if (this.screenWidth <= 900 || this.sidebarDrawer) {
        this.sidebarShow = false
      }
    }
  }
}
</script>

<style scoped>
    .aaa{
        transition: margin-left 0.35s;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
    }
</style>
