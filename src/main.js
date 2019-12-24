import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './components/components'
import * as filters from './filters' // global filters
import vuetify from './plugins/vuetify'

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
})
