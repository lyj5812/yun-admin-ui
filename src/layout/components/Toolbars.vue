<template>
  <v-app-bar class="box-shadow" :color="$vuetify.theme.dark?'':'white'" :class="['app-bar',$vuetify.theme.dark?'':toolColor.class]" :dark="$vuetify.theme.dark&&toolColor.dark" fixed app>
    <v-app-bar-nav-icon class="hidden-lg-and-up" :dark="toolColor.dark" @click.stop="setDrawer()" />
    <v-btn
      icon
      :dark="toolColor.dark"
      class="hidden-md-and-down"
      @click.stop="mini=!mini"
    >
      <v-icon v-if="mini">fas fa-arrow-circle-right</v-icon>
      <v-icon v-else>fas fa-arrow-circle-left</v-icon>
    </v-btn>
    <div class="ml-8 menu-search">
      <v-autocomplete
        v-model="menu"
        class="hidden-sm-and-down "
        prepend-inner-icon="search"
        label="搜索"
        dense
        chips
        :items="people"
        item-value="path"
        hide-no-data
        width="15"
        hide-details
        single-line
        clearable
        :dark="toolColor.dark"
        filled
        cache-items
        rounded
      >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            @click="data.select"
          >
            <v-avatar left>
              <v-icon v-text="data.item.icon" />
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <template>
            <v-list-item-avatar>
              <v-icon v-text="data.item.icon" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.name" />
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </div>
    <v-spacer />
    <!--全屏-->
    <v-btn icon :dark="toolColor.dark" @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-btn icon :dark="toolColor.dark" @click.stop="setSettingDrawer()">
      <v-icon>fas fa-palette</v-icon>
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
  computed: {
    ...mapGetters({
      avatar: 'avatar',
      name: 'name',
      toolColor: 'app/toolColor',
      navMini: 'app/navMini'
    }),
    mini: {
      get() {
        return this.navMini
      },
      set(value) {
        this.$store.dispatch('app/setNavMini', value)
      }
    }
  },
  watch: {
    menu(val) {
      this.$router.push({ path: val || '/' })
    }
  },
  data() {
    return {
      people: [
        { name: '用户管理', icon: 'edit', path: '/auth/user' },
        { name: '个人中心', icon: 'add', path: '/user/profile' }
      ],
      menu: null
    }
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
      width: 30px;
      transition: all 0.5s ease 0s;
  }

  .menu-search >>> input:focus {
      width: 80px;
  }
</style>
