<template>
  <v-app :class="primaryColor.scheme">
    <router-view />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      primaryColor: 'app/primaryColor',
      sidebarDrawer: 'navColor/navColor'
    })
  },
  mounted() {
    document.getElementById('app').style.display = 'block'
    document.getElementById('appLoading').style.display = 'none'
  }

}
</script>

<style lang="scss">
    @import "sass/main.scss";
</style>
