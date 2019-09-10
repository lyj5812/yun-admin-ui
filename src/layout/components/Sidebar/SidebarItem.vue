<template>
  <div v-if="!item.hidden">
    <template v-if="!item.children">
      <!--无子菜单-->
      <v-list-item active-class="box-glow" :to="item.path">
        <v-list-item-icon>
          <v-icon size="18" class="mt-1">{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </template>
    <!--有子菜单-->
    <v-list-group
      v-else
      :group="item.path"
      :prepend-icon="item.icon"
      class="menu-group"
      no-action
      :active-class="navColor.dark||$vuetify.theme.dark?'nav-white-active':'nav-black-active'"
    >
      <template #activator>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </v-list-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      navColor: 'app/navColor'
    })
  }
}
</script>
<style lang="css" scoped>
    .menu-group >>> .v-list-group__header__prepend-icon .v-icon{
        height: .7em !important;
        width: .7em !important;
        margin-top: .2em;
    }

    .menu-group >>> .v-list-group__header__prepend-icon i{
        font-size: 1.1em;
        margin-left: .2em;
        margin-top: .4em;
    }
</style>
