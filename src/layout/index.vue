<template>
  <div class="outer-container">
    <div class="inner-container">
      <div class="content">
        <navbar />
        <toolbars />
        <v-content>
          <app-main />
        </v-content>
        <Footer />
        <speed-dial />
        <app-settings />
      </div>
    </div>
  </div>
</template>
<script>
import Toolbars from './components/Toolbars'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppMain from './components/AppMain'
import SpeedDial from './components/SpeedDial'
import AppSettings from './components/AppSettings'
export default {
  components: {
    AppMain,
    Navbar,
    Toolbars,
    Footer,
    SpeedDial,
    AppSettings
  }
}
</script>
