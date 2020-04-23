<template>
  <div>
    <color-scheme @clickItem="setColor" />
  </div>
</template>
<script>
import ColorScheme from './ColorScheme'
import { mapGetters } from 'vuex'
export default {
  components: {
    ColorScheme
  },
  computed: {
    ...mapGetters({
      primaryColor: 'app/primaryColor'
    })
  },
  methods: {
    setColor(item) {
      if (this.primaryColor.dark) {
        this.$message.error('请使用明亮主题！')
      } else {
        this.$store.dispatch('app/setNavColor', item)
      }
    }
  }
}
</script>
