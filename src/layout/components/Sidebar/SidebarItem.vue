<template>
  <div v-if="!item.hidden">
    <template v-if="!item.children">
      <!--无子菜单-->
      <v-list-item active-class="primary nav-white-active" :to="item.path">
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
      no-action
      :active-class="navColor.dark?'nav-white-active':'nav-black-active'"
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
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
