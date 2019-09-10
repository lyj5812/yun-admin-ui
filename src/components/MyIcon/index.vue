<template>
  <svg-icon :icon-class="name" />
</template>

<script>
export default {
  name: 'MyIcon',
  props: {
    name: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
