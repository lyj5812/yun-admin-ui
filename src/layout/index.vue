<template>
  <div class="outer-container">
    <div class="inner-container">
      <div class="content">
        <navbar />
        <toolbars />
        <v-content>
          <app-main />
        </v-content>
        <app-settings />
      </div>
    </div>
  </div>
</template>
<script>
import Toolbars from './components/Toolbars'
import Navbar from './components/Navbar'
import AppMain from './components/AppMain'
import AppSettings from './components/AppSettings'
export default {
  components: {
    AppMain,
    Navbar,
    Toolbars,
    AppSettings
  }
}
</script>
