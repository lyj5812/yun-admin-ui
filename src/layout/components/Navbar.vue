<template>
  <v-navigation-drawer id="appDrawer" v-model="drawer" :dark="navColor.dark" :class="[$vuetify.theme.dark?'':navColor.class,'elevation-3']" app :mini-variant.sync="mini" fixed>
    <v-layout row pa-2 elevation-1>
      <v-avatar class="ml-3">
        <v-img lazy-src="https://vuetifyjs.com/apple-touch-icon-180x180.png" src="https://vuetifyjs.com/apple-touch-icon-180x180.png" />
      </v-avatar>
      <v-toolbar-title class="pl-2">
        <v-list-item v-if="!mini" class="hidden-xs-and-down font-weight-regular">
          YUN Admin
          <v-btn x-small text icon class="ml-3" @click="mini=!mini">
            <v-icon small>radio_button_checked</v-icon>
          </v-btn>
        </v-list-item>
      </v-toolbar-title>
    </v-layout>
    <v-divider />
    <!--侧边栏-->
    <sidebar />
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './Sidebar'
export default {
  components: {
    Sidebar
  },
  data() {
    return {
      mini: false
    }
  },
  computed: {
    ...mapGetters('app', ['navDrawer', 'navColor']),
    drawer: {
      get() {
        return this.navDrawer
      },
      set(value) {
        this.$store.dispatch('app/setNavDrawer', value)
      }
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  #appDrawer >>> .v-navigation-drawer__content{
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  #appDrawer >>> .v-btn.v-btn--icon, .v-toolbar__extension .v-btn.v-btn--icon {
    height: auto;
    width: auto;
  }
</style>
