import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import store from '@/store'
import colors from 'vuetify/lib/util/colors'
import zhHans from 'vuetify/es5/locale/zh-Hans.js'
Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: 'zhHans'
  },
  theme: {
    themes: {
      light: {
        primary: store.getters['app/primaryColor'].primary,
        success: colors.green.lighten1,
        warning: colors.amber.accent3,
        accent: colors.shades.black,
        error: colors.red.accent3
      },
      dark: {
        primary: store.getters['app/primaryColor'].primary
      }
    },
    dark: store.getters['app/primaryColor'].dark
  },
  icons: {
    iconfont: 'md'
  }
})
