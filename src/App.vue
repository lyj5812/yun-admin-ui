<template>
  <v-app :class="primaryColor.scheme">
    <router-view />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  mounted() {
    document.getElementById('app').style.display = 'block'
    document.getElementById('appLoading').style.display = 'none'
  },
  computed: {
    ...mapGetters({
      primaryColor: 'app/primaryColor',
      sidebarDrawer: 'navColor/navColor'
    })
  }
}
</script>

<style lang="scss">
    @import "sass/main.scss";
</style>
