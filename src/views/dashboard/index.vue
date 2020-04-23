<template>
  <v-container fluid>
    <line-marker height="600px" class="pa-5" width="100%" />
  </v-container>
</template>

<script>
import LineMarker from './components/LineMarker'
export default {
  name: 'Dashboard',
  components: { LineMarker }
}
</script>
