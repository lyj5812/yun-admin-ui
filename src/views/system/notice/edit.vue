<template>
  <v-container>
    <CkEditor />
  </v-container>
</template>

<script>
import CkEditor from '@/components/CkEditor'
export default {
  components: {
    CkEditor
  },
  data() {
    return {
      content: ''
    }
  }
}
</script>
