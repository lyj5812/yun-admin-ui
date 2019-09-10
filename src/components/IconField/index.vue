<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-menu v-model="menu" attach offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="value"
            :prepend-inner-icon="value"
            :disabled="disabled"
            label="节点图标"
            class="small"
            outlined
            hide-details
            clearable
            v-on="on"
          />
        </template>
        <v-tabs v-model="tabs">

          <v-tab href="#tab-1">material</v-tab>
          <v-tab href="#tab-2">font-awesome4</v-tab>
          <v-tab href="#tab-3">自定义</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs">

          <v-tab-item
            value="tab-1"
          >
            <v-card flat>
              <v-card-text>
                <v-row class="pa-2">
                  <v-col
                    v-for="(item, index) in mdList"
                    :key="index"
                    cols="1"
                    xs="1"
                    md="1"
                    @click="setIcon(item.ligature)"
                  >
                    <v-icon style="cursor: pointer;" medium>{{ item.ligature }}</v-icon>
                  </v-col>
                </v-row>
                <v-pagination
                  v-model="mdPage.page"
                  :length="mdPage.pageCount"
                  :total-visible="8"
                  circle
                  @input="loadMdList(mdPage.page,mdPage.pageSize)"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item
            value="tab-2"
          >
            <v-card flat>
              <v-card-text>
                <v-row class="pa-2">
                  <v-col
                    v-for="(item, index) in font4List"
                    :key="index"
                    cols="1"
                    xs="1"
                    md="1"
                    @click="setIcon(item)"
                  >
                    <v-icon style="cursor: pointer;" medium>{{ item }}</v-icon>
                  </v-col>
                </v-row>
                <v-pagination
                  v-model="font4Page.page"
                  :length="font4Page.pageCount"
                  :total-visible="8"
                  circle
                  @input="loadFont4List(font4Page.page,font4Page.pageSize)"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item
            value="tab-3"
          >
            <v-card flat>
              <v-card-text>
                <v-row class="pa-2">
                  <v-col
                    v-for="(item, index) in svgList"
                    :key="index"
                    cols="1"
                    xs="1"
                    md="1"
                    @click="setIcon('$vuetify.icons.'+item)"
                  >
                    <v-icon style="cursor: pointer;" medium>{{ '$vuetify.icons.'+item }}</v-icon>
                  </v-col>
                </v-row>
                <v-pagination
                  v-model="svgPage.page"
                  :length="svgPage.pageCount"
                  :total-visible="8"
                  circle
                  @input="loadSvgList(svgPage.page,svgPage.pageSize)"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import fontData from '@/api/font-awesome.json'
import mdDate from '@/api/material.json'
import svgIcons from '@/plugins/svg-icons'

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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: null,
      menu: false,
      tabs: null,
      svgList: [],
      svgPage: {
        page: 1,
        pageSize: 60,
        pageCount: 0
      },
      mdList: [],
      mdPage: {
        page: 1,
        pageSize: 60,
        pageCount: 0
      },
      font4List: [],
      font4Page: {
        page: 1,
        pageSize: 60,
        pageCount: 0
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.$emit('selected', this.value)
    },
    iconValue(newVal, oldVal) {
      this.value = newVal
    }
  },
  created() {
    this.value = this.iconValue
    this.loadMdList(this.mdPage.page, this.mdPage.pageSize)
    this.loadFont4List(this.font4Page.page, this.font4Page.pageSize)
    this.loadSvgList(this.svgPage.page, this.svgPage.pageSize)
  },
  methods: {
    loadMdList(page, pageSize) {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      this.mdPage.pageCount = Math.ceil(mdDate.icons.length / this.mdPage.pageSize)
      this.mdList = mdDate.icons.slice(start, end)
    },
    loadFont4List(page, pageSize) {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      this.font4Page.pageCount = Math.ceil(fontData['4.7.0'].length / this.font4Page.pageSize)
      this.font4List = fontData['4.7.0'].slice(start, end)
    },
    loadSvgList(page, pageSize) {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      this.svgPage.pageCount = Math.ceil(svgIcons.length / this.svgPage.pageSize)
      this.svgList = svgIcons.slice(start, end)
    },
    setIcon(value) {
      this.$emit('selected', value)
      this.menu = false
    }
  }
}
</script>

