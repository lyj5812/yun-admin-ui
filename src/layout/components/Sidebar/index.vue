<template>
  <v-scroll>
    <v-list class="myMenu yun-sidebar" dense>
      <sidebar-item v-for="route in routers" :key="route.path" :item="route" />
    </v-list>
  </v-scroll>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters({
      routers: 'permission_routers'
    })
  }
}
</script>
