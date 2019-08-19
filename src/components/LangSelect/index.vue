<template>
  <div class="text-xs-center">
    <v-menu v-model="showFlag" offset-y>
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <svg-icon class-name="international-icon" icon-class="language" />
        </div>
      </template>
      <v-list>
        <v-list-item-group v-model="lang" color="primary">
          <v-list-item :disabled="language==='zh'" @click="handleSetLanguage('zh')">
            <v-list-item-title>中文</v-list-item-title>
          </v-list-item>
          <v-list-item :disabled="language==='en'" @click="handleSetLanguage('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
          <v-list-item :disabled="language==='es'" @click="handleSetLanguage('es')">
            <v-list-item-title>Español</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false,
      lang: null
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.showFlag = false
    }
  }
}
</script>

<style scoped>
  .international-icon {
    font-size: 20px;
    cursor: pointer;
    vertical-align: -5px !important;
  }
</style>

