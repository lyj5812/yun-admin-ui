<template>
  <v-navigation-drawer
    id="appDrawer"
    v-model="drawer"
    :expand-on-hover="navMini"
    :dark="navColor.dark"
    :class="[$vuetify.theme.dark?'':navColor.class,'nav-box']"
    app
    :mini-variant="navMini"
    fixed
  >
    <v-toolbar-title dense flat class="text-xs-center z-index-2">
      <v-list>
        <v-list-item>
          <v-list-item-avatar tile>
            <v-icon size="30">
              $vuetify.icons.logo
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">Yun Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-toolbar-title>
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
      vuetify: this.$vuetify
    }
  },
  computed: {
    ...mapGetters('app', ['navDrawer', 'navMini', 'navColor']),
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

<style lang="css" scoped>
  #appDrawer >>> .v-navigation-drawer__content{
      height: 100%;
      overflow-y: hidden;
      overflow-x: hidden;
  }
  #appDrawer >>> .v-btn.v-btn--icon, .v-toolbar__extension .v-btn.v-btn--icon {
    height: auto;
    width: auto;
  }
  .nav-box{
    box-shadow: 0 6px 6px -3px rgba(0,0,0,.2),0 10px 14px 1px rgba(0,0,0,.14),0 4px 18px 3px rgba(0,0,0,.12)!important;
  }
</style>
