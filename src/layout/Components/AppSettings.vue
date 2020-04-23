<template>
  <v-navigation-drawer
    v-model="drawer"
    right
    fixed
    temporary
    floating
    class="elevation-5 pb-0"
    hide-overlay
  >
    <v-scroll>
      <!-- Settings drawer heading and close button -->
      <v-toolbar>
        <v-toolbar-title>主题设置</v-toolbar-title>
        <v-spacer />
        <template>
          <v-btn small icon text left @click.native.stop="drawer=!drawer">
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>

      <v-tabs v-model="tab" centered class="mt-3">
        <v-tabs-slider />
        <v-tab href="#tab-1">
          菜单栏
        </v-tab>
        <v-tab href="#tab-2">
          工具栏
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <nav-color />
        </v-tab-item>
        <v-tab-item value="tab-2">
          <tool-color />
        </v-tab-item>
      </v-tabs-items>

      <primary-color />
    </v-scroll>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex'
import NavColor from './Settings/NavColor'
import ToolColor from './Settings/ToolColor'
import PrimaryColor from './Settings/PrimaryColor'
export default {
  components: {
    NavColor,
    ToolColor,
    PrimaryColor
  },
  data() {
    return {
      tab: null
    }
  },
  computed: {
    ...mapGetters({
      settingDrawer: 'app/settingDrawer'
    }),
    drawer: {
      get() {
        return this.settingDrawer
      },
      set(value) {
        this.$store.dispatch('app/setSettingDrawer', value)
      }
    }
  }
}
</script>
