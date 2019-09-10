<template>
  <v-card class="dashboard-container pr-15">
    <line-marker height="600px" width="85.5vw" />
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
