<template>
  <v-app id="app" :class="primaryColor.scheme">
    <router-view />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters('app', ['primaryColor'])
  },
  mounted() {
    try {
      document.body.removeChild(document.getElementById('appLoading'))
      setTimeout(function() {
        document.getElementById('app').style.display = 'block'
      }, 800)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
