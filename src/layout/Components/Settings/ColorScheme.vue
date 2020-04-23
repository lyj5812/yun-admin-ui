<template>
  <v-layout row wrap pa-5 ml-2>
    <v-flex v-for="item in navColors" :key="item.name" lg2 xs2>
      <v-btn class="elevation-3" icon max-height="20" max-width="20" :class="item.class" @click="setColor(item)" />
    </v-flex>
  </v-layout>
</template>
<script>
import AppColorScheme from './AppColorScheme'
export default {
  name: 'ColorScheme',
  computed: {
    navColors() {
      return AppColorScheme.navColor
    }
  },
  methods: {
    setColor(item) {
      this.$emit('clickItem', item)
    }
  }
}
</script>
