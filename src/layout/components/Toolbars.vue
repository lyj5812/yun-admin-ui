<template>
  <v-app-bar :color="$vuetify.theme.dark?'':'white'" :class="['app-bar',$vuetify.theme.dark?'':toolColor.class]" :dark="$vuetify.theme.dark&&toolColor.dark" fixed app>
    <v-app-bar-nav-icon :dark="toolColor.dark" @click.stop="setDrawer()" />

    <v-autocomplete
      class="ml-5 hidden-sm-and-down"
      prepend-inner-icon="search"
      dense
      hide-no-data
      hide-details
      label="搜索"
      single-line
      :dark="toolColor.dark"
      filled
      rounded
    />
    <v-spacer />
    <!--全屏-->
    <v-btn icon :dark="toolColor.dark" @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-menu
      bottom
      right
      transition="scale-transition"
      origin="top left"
    >
      <template #activator="{ on }">
        <!--用户头像-->
        <v-btn icon large text v-on="on">
          <v-avatar size="30px">
            <img :src="avatar" alt="Michael Wang">
          </v-avatar>
        </v-btn>
      </template>
      <v-card width="300">
        <v-img :src="avatar" />
      </v-card>
    </v-menu>
    <v-menu offset-y>
      <template #activator="{ on }">
        <v-btn :dark="toolColor.dark" small text v-on="on">
          {{ name }} &nbsp;<v-icon small>fa fa-angle-down</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>account_circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>用户信息</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>修改密码</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon>fullscreen_exit</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>退出登录</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <template v-slot:extension>
      <tags-view />
    </template>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import TagsView from './TagsView'
import { toggleFullScreen } from '@/utils'
export default {
  components: { TagsView },
  data() {
    return {
      mini: false
    }
  },
  computed: {
    ...mapGetters({
      avatar: 'avatar',
      name: 'name',
      toolColor: 'app/toolColor'
    })
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('tagsView/delAllViews')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleFullScreen() {
      toggleFullScreen()
    },
    async setDrawer() {
      await this.$store.dispatch('app/setNavDrawer', !this.$store.state.app.navDrawer)
    }
  }
}
</script>

<style lang="css" scoped>
  #appDrawer >>> .v-navigation-drawer__content {
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  .app-bar >>> .v-toolbar__extension {
    padding: 4px 0px;
  }
</style>
