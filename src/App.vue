<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',
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
