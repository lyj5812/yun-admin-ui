<template>
  <v-scroll>
    <div class="myMenu yun-sidebar">
      <sidebar-item v-for="route in routers" :key="route.path" :item="route" />
    </div>
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
<style lang="css" scoped>
    .yun-sidebar >>> .v-list {
        padding: 0;
    }

    >>> .v-list-group .v-list-group .v-list-group__header .v-list-item__icon{
        margin-left: 8px;
    }

    >>> .v-list-group .v-list-group .v-list-group__header .v-list-item__icon{
        margin-left: 8px;
    }

    >>> .v-list-group .v-list-group .v-list-group .v-list-group__header .v-list-item__icon{
        margin-left: 16px;
    }

    >>> .v-list-group .v-list-group__items .v-list-item__icon{
        margin-left: 8px;
    }

    >>> .v-list-group .v-list-group .v-list-group .v-list-group__items .v-list-item__icon{
        margin-left: 26px;
    }

</style>
