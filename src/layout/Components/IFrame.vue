<template>
  <v-container class="iframe-container" fluid>
    <iframe ref="iframe" :src="src" scrolling="auto" frameborder="0" class="frame" />
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      src: ''
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        // 如果是跳转到嵌套页面，切换iframe的url
        this.resetSrc(this.$store.state.iframe.iframeUrls)
      }
    }
  },
  mounted() {
    this.resetSrc(this.$store.state.iframe.iframeUrls)
  },
  methods: {
    // 获取路径
    resetSrc: function(arr) {
      const that = this
      if (arr.length > 0) {
        const iframe = arr.find((element) => (element.path === that.$route.path))
        if (iframe) {
          that.src = iframe.url
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .iframe-container {
    top: 10px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    width: 100%;
    .frame {
      position: relative;
      top: 0px;
      width: 100%;
      height: 100vh;
    }
  }
</style>
