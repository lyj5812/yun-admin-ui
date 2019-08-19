import Vue from 'vue'
import Vuetify from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'font-awesome/css/font-awesome.min.css'
import 'vuetify/dist/vuetify.min.css'
import '@/sass/main.scss'
import store from '@/store'
import colors from 'vuetify/lib/util/colors'
Vue.use(Vuetify)
export default new Vuetify({
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
