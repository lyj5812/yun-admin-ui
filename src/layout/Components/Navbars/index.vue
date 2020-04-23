<template>
  <v-app-bar class="box-shadow" :color="$vuetify.theme.dark?'':'white'" :class="['app-bar',$vuetify.theme.dark?'':toolColor.class]" :dark="$vuetify.theme.dark&&toolColor.dark" fixed app>
    <v-app-bar-nav-icon class="hidden-lg-and-up" :dark="toolColor.dark" @click.stop="setSidebarMini" />
    <v-btn
      icon
      :dark="toolColor.dark"
      class="hidden-md-and-down"
      @click="setSidebarMini"
    >
      <v-icon v-if="sidebarDrawer">fas fa-arrow-circle-right</v-icon>
      <v-icon v-else>fas fa-arrow-circle-left</v-icon>
    </v-btn>
    <div class="ml-8 menu-search">
      <v-text-field
        v-model="menu"
        class="hidden-sm-and-down "
        prepend-inner-icon="search"
        label="搜索"
        dense
        chips
        item-value="path"
        hide-no-data
        width="35"
        hide-details
        single-line
        clearable
        :dark="toolColor.dark"
        filled
        rounded
      />
    </div>
    <v-spacer />
    <!--全屏-->
    <v-btn icon :dark="toolColor.dark" @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-btn icon :dark="toolColor.dark" @click.stop="setSettingDrawer()">
      <v-icon>mdi-tshirt-crew-outline</v-icon>
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
            <img :src="user.avatar" alt="Michael Wang">
          </v-avatar>
        </v-btn>
      </template>
      <v-card width="300">
        <v-img :src="user.avatar" />
      </v-card>
    </v-menu>
    <v-menu offset-y>
      <template #activator="{ on }">
        <v-btn :dark="toolColor.dark" small text v-on="on">
          {{ user.realName }} &nbsp;<v-icon small>fa fa-angle-down</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item to="/dashboard">
          <v-list-item-icon>
            <v-icon>settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>首页</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/user/profile">
          <v-list-item-icon>
            <v-icon>account_circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>个人中心</v-list-item-title>
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
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import { toggleFullScreen } from '@/utils'
export default {
  data() {
    return {
      people: [
        { name: '用户管理', icon: 'edit', path: '/auth/user' },
        { name: '个人中心', icon: 'add', path: '/user/profile' }
      ],
      menu: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      toolColor: 'app/toolColor',
      sidebarDrawer: 'app/sidebarDrawer'
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
    setSidebarMini() {
      this.$emit('clickNavIcon')
    },
    async setSettingDrawer() {
      await this.$store.dispatch('app/setSettingDrawer', !this.$store.state.app.settingDrawer)
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

    .menu-search >>> input{
        width: 50px;
        transition: all 0.5s ease 0s;
    }

    .menu-search >>> input:focus {
        width: 80px;
    }
</style>
