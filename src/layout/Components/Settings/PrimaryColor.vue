<template>
  <div class="text-xs-center pa-3">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          主题色
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-tabs v-model="tab" centered class="mt-3">
      <v-tabs-slider />
      <v-tab href="#tab-1">
        明亮
      </v-tab>
      <v-tab href="#tab-2">
        暗黑
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <v-layout justify-center row wrap pa-1>
          <v-radio-group v-model="primaryColor" column>
            <v-layout v-for="item in lightColors" :key="item.name" row mb-2>
              <v-radio :value="item.name" @change="setColor(item)" />
              <v-btn x-small :color="item.primary" />
              <v-btn x-small :class="[item.dark?'black':'white','ml-2','elevation-3']" />
            </v-layout>
          </v-radio-group>
        </v-layout>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <v-layout row justify-center wrap pa-1>
          <v-radio-group v-model="primaryColor" column>
            <v-layout v-for="item in darkColors" :key="item.name" row mb-2>
              <v-radio :value="item.name" @change="setColor(item)" />
              <v-btn x-small :color="item.primary" />
              <v-btn x-small :class="[item.dark?'black':'white','ml-2','elevation-3']" />
            </v-layout>
          </v-radio-group>
        </v-layout>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import AppColorScheme from './AppColorScheme'
export default {
  name: 'PrimaryColor',
  data() {
    return {
      tab: null,
      primaryColor: this.$store.getters['app/primaryColor'].name
    }
  },
  computed: {
    lightColors() {
      return AppColorScheme.lightColor
    },
    darkColors() {
      return AppColorScheme.darkColor
    }
  },
  methods: {
    setColor(value) {
      this.$store.dispatch('app/setPrimaryColor', value)
      if (value.dark) {
        this.$vuetify.theme.dark = value.dark
        this.$vuetify.theme.themes.dark.primary = value.primary
      } else {
        this.$vuetify.theme.dark = value.dark
        this.$vuetify.theme.themes.light.primary = value.primary
      }
    }
  }
}
</script>
