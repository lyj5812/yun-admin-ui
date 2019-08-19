<template>
  <v-card class="dashboard-container">
    <line-marker height="600px" width="100vw" />
  </v-card>
</template>

<script>
import LineMarker from './components/LineMarker'
export default {
  name: 'Dashboard',
  components: { LineMarker },
  methods: {
  }
}
</script>
