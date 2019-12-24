<template>
  <v-app id="app" :class="primaryColor.scheme">
    <router-view />
    <v-sheet
      class="px-3 pb-3 "
      :color="`grey ${vuetify.theme.isDark ? 'darken-2' : 'lighten-4'}`"
    >
      <v-row>
        <v-col v-if="vuetify.breakpoint.xl||vuetify.breakpoint.lg" cols="12" lg="2" :class="[vuetify.theme.dark?'':navColor.class,'elevation-3']">
          <v-skeleton-loader
            class="mx-auto"
            type="avatar mb-3"
          />
          <v-skeleton-loader
            v-for="i in 30"
            :key="i"
            class="mx-auto"
            min-width="200%"
            type="heading mt-3"
          />
        </v-col>
        <v-col cols="12" lg="10">
          <v-skeleton-loader
            class="mx-auto"
            type="paragraph"
          />
          <v-skeleton-loader
            class="mx-auto"
            type="table-row-divider"
          />

          <v-skeleton-loader
            class="mx-auto"
            type="table-heading, table-thead, table-tbody, table-tfoot"
          />
        </v-col>
      </v-row>

    </v-sheet>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      vuetify: this.$vuetify
    }
  },
  computed: {
    ...mapGetters('app', ['primaryColor', 'navColor'])
  }
}
</script>
