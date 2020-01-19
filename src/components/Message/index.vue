<template>
  <v-snackbar
    v-model="visible"
    :color="color"
    top
    :timeout="time"
    :right="right"
    style="margin-top: 80px"
  >
    <v-icon v-if="type=='info'" dark medium>info</v-icon>
    <v-icon v-else-if="type=='success'" dark medium>fa-check-circle</v-icon>
    <v-icon v-else-if="type=='warning'" dark medium>warning</v-icon>
    <v-icon v-else-if="type=='error'" dark medium>error</v-icon>
    {{ content }}
    <v-btn v-if="close" fab x-small icon dark @click="visible = false">
      <v-icon dark small>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
      content: '',
      time: 3000,
      visible: false,
      type: 'success', // 'success','warning','error'
      close: true,
      right: false
    }
  },
  computed: {
    color() {
      if (this.type === 'success') {
        return 'green'
      } else if (this.type === 'warning') {
        return 'yellow darken-1'
      } else if (this.type === 'error') {
        return 'red darken-1'
      } else {
        return 'blue lighten-1'
      }
    }
  }
}
</script>
