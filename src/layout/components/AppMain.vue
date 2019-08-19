<template>
  <v-container id="container" fluid grid-list-md>
    <keep-alive :include="cachedViews">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </keep-alive>
  </v-container>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
<style lang="scss" scoped>
  #container{
    max-width: 100%;
  }
</style>
