<template>
  <div class="dashboard-container pr-15">
    <line-marker height="600px" width="85.5vw" />
  </div>
</template>

<script>
import LineMarker from './components/LineMarker'
export default {
  name: 'Dashboard',
  components: { LineMarker }
}
</script>
