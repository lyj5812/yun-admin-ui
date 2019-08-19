<template>
  <v-speed-dial
    :top="false"
    :right="true"
    :left="false"
    fixed
    direction="top"
    open-on-hover
    transition="slide-y-reverse-transition"
    style="top:90%"
  >
    <template v-slot:activator>
      <v-btn
        color="primary"
        dark
        fab
        small
      >
        <v-icon>account_circle</v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      dark
      color="green"
      small
      class="mt-2 mb-2"
    >
      <v-icon>fas fa-cog fa-spin</v-icon>
    </v-btn>
    <v-btn
      class="mt-2"
      fab
      dark
      small
      color="indigo"
      @click.stop="setSettingDrawer()"
    >
      <v-icon>fas fa-palette</v-icon>
    </v-btn>
    <v-btn
      class="mt-2"
      fab
      small
      dark
      color="red"
    >
      <v-icon>fab fa-weixin</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    async setSettingDrawer() {
      await this.$store.dispatch('app/setSettingDrawer', !this.$store.state.app.settingDrawer)
    }
  }
}
</script>
