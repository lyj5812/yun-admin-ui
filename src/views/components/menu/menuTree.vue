<template>
  <v-layout>
    <v-flex xs12>
      <v-card flat>
        <v-text-field
          v-model="search"
          label="搜索"
          clearable
          class="small"
          outlined
          prepend-inner-icon="search"
          :append-outer-icon="openAll?'vertical_align_center':'swap_vert'"
          flat
          @click:append-outer="opneOrCloseAll()"
        />
        <v-treeview
          v-model="tree"
          :items="menus"
          dense
          :open.sync="open"
          :search="search"
          :filter="filter"
          item-key="menuId"
          activatable
          :selectable="selectable"
          selected-color="primary"
          active-class="primary--text"
          class="lighten-5"
          :active.sync="active"
          transition
        >
          <template v-slot:label="{ item, active }">
            <v-layout
              class="body-1 font-weight-medium"
              row
              wrap
              @click="selectdItem(item)"
            >
              <v-flex
                xs8
                md8
              >
                  &nbsp;
                <v-icon
                  v-if="item.menuType==0"
                  size="22"
                  :color="active ? 'primary' : ''"
                >
                  {{ item.icon }}
                </v-icon>
                {{ item.name }}
              </v-flex>
              <v-flex
                xs4
                md4
              >
                <v-btn
                  v-if="item.menuType==0"
                  x-small
                  class="ml-2"
                  color="indigo"
                  dark
                >菜单
                </v-btn>
                <v-btn
                  v-if="item.menuType==1"
                  x-small
                  color="purple"
                  dark
                >按钮
                </v-btn>
              </v-flex>
            </v-layout>
          </template>
        </v-treeview>
        <v-overlay
          absolute
          :value="dataFlag"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </v-overlay>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { menuList } from '@/api/system/menu'
export default {
  name: 'MenuTree',
  props: {
    selectable: {
      type: Boolean,
      default: false
    },
    openFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: [],
      open: [],
      dataFlag: true,
      tree: [],
      search: null,
      openAll: false,
      caseSensitive: false,
      menuIds: [],
      parentIds: [],
      menus: []
    }
  },
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    }

  },
  watch: {
    open(newVal, oldVal) {
      this.openAll = newVal.length === this.menuIds.length && newVal.every(a => this.menuIds.some(b => a === b)) && this.menuIds.every(_b => newVal.some(_a => _a === _b))
    },
    tree(newVal, oldVal) {
      this.getMenuIds()
    }
  },
  created() {
    this.getMenuList()
  },

  methods: {
    /**
     * 菜单树数据
     */
    getMenuList() {
      this.dataFlag = true
      menuList().then(res => {
        this.menus = res.data.data
        this.dataFlag = false
        this.opneOrClose()
        if (this.openFlag) {
          this.open = this.menuIds
        } else {
          this.openAll = false
        }
      }).catch(() => {

      })
    },
    selectdItem(item) {
      // 直接等于是引用,menu改变,item会跟着改变...
      const menu = JSON.parse(JSON.stringify(item))
      this.$emit('clickNode', menu)
    },
    opneOrClose() {
      this.recursionMenuId(this.menuIds, this.menus)
    },
    opneOrCloseAll() {
      if (this.openAll) {
        this.open = []
      } else {
        this.open = this.menuIds
      }
    },
    recursionMenuId(menuIds, menu) {
      menu.forEach(item => {
        if (item.children) {
          menuIds.push(item.menuId)
          this.recursionMenuId(menuIds, item.children)
        }
      })
    },
    recursionMenu(menus, menu) {
      menu.forEach(item => {
        menus.push(item)
        if (item.children) {
          this.recursionMenu(menus, item.children)
        }
      })
    },
    /**
     * 获取所有id
     */
    getMenuIds() {
      let parentIds = []
      const list = []
      this.recursionMenu(list, this.menus)
      this.tree.forEach(item => {
        let menuId = item
        while (menuId !== 0 && menuId) {
          const menu = list.find((element) => (element.menuId === menuId))
          parentIds.push(menu.parentId)
          menuId = menu.parentId
        }
      })
      parentIds.push(...this.tree)
      parentIds = Array.from(new Set(parentIds))
      return parentIds
    },
    /**
     * 获取最底层子id
     * @param menuId
     * @param rlist
     */
    setMenuIds(ids) {
      const list = []
      menuList().then(res => {
        const menus = res.data.data
        this.recursionMenu(list, menus)
        const childrenIds = []
        ids.forEach(item => {
          const menu = list.find((element) => (element.menuId === item))
          if (!menu.children) {
            childrenIds.push(menu.menuId)
          }
        })
        this.tree = childrenIds
      })
    }
  }
}
</script>
