<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-y
      max-width="700"
    >
      <template v-slot:activator="{}">
        <div @click="menu=true">
          <v-text-field
            v-model="value"
            disabled
            :prepend-inner-icon="value"
            v-bind="$attrs"
            v-on="$listeners"
          />
        </div>
      </template>

      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="auto">
              <v-text-field
                v-model="search"
                label="搜索"
                dense
                outlined
                clearable
                hide-details
                prepend-inner-icon="search"
                @keyup="searchIcon()"
                @click:clear="clearSearch()"
              />
            </v-col>
          </v-row>
          <v-row class="pa-2">
            <v-col
              v-for="(item, index) in mdiList"
              :key="index"
              cols="1"
              xs="1"
              md="1"
              @click="setIcon(item.name)"
            >
              <v-icon style="cursor: pointer;" medium>{{ item.name }}</v-icon>
            </v-col>
          </v-row>
          <v-pagination
            v-model="page.current"
            :length="page.pageCount"
            :total-visible="8"
            circle
            @input="loadPageList()"
          />
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import icons from './icons'
export default {
  name: 'IconField',
  model: {
    prop: 'iconValue',
    event: 'selected'
  },
  props: {
    iconValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: null,
      menu: false,
      search: '',
      icons: icons,
      mdiList: [],
      iconsList: [],
      page: {
        current: 1,
        pageSize: 36,
        pageCount: 0
      }
    }
  },
  watch: {
    iconValue(newVal, oldVal) {
      this.value = newVal
    }
  },
  created() {
    this.iconsList = this.icons
    this.value = this.iconValue
    this.loadPageList()
  },
  methods: {
    setIcon(icon) {
      this.$emit('selected', icon)
      this.value = icon
      this.menu = false
    },
    loadPageList() {
      const start = (this.page.current - 1) * this.page.pageSize
      const end = start + this.page.pageSize
      this.page.pageCount = Math.ceil(this.iconsList.length / this.page.pageSize)
      this.mdiList = this.iconsList.slice(start, end)
    },
    clearSearch() {
      this.search = ''
      this.searchIcon()
    },
    searchIcon() {
      if (this.search) {
        this.page.current = 1
        const reg = new RegExp(this.search)
        this.iconsList = this.icons.filter((item) => {
          return reg.test(item.name)
        })
      } else {
        this.page.current = 1
        this.iconsList = this.icons
      }
      this.loadPageList()
    }
  }
}
</script>
