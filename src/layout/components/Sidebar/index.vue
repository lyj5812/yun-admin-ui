<template>
  <v-scroll>
    <v-list class="myMenu" dense shaped>
      <sidebar-item v-for="route in menus" :key="route.path" :item="route" />
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
      menus: 'permission/menus'
    })
  }
}
</script>
