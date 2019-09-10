<template>
  <v-row>
    <v-col cols="12" lg="12">
      <v-toolbar flat class="transparent mb-3">
        <v-avatar class="box-glow" tile>
          <v-icon dark>fa fa-sticky-note</v-icon>
        </v-avatar>
        <v-toolbar-title class="primary--text hidden-xs-only ml-3">代码生成</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
    </v-col>
    <v-col cols="12" lg="2">
      <v-navigation-drawer
        hide-overlay
        :permanent="$vuetify.breakpoint.mdAndUp"
        enable-resize-watcher
        :mini-variant="$vuetify.breakpoint.smAndDown"
        :temporary="$vuetify.breakpoint.smAndDown"
        class="contact-nav-drawer"
        floating
      >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="subtitle-1 font-weight-medium font-weight-bold">我的数据源</v-list-item-title>
                <v-list-item-subtitle>数据源列表</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn class="mx-2" fab dark x-small color="primary">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-toolbar>
        <v-divider />
        <v-list dense nav class="pt-0 inner-sidebar v-menu-trans-list-npd">
          <v-list-item-group v-model="dataSource" mandatory color="primary" @change="loadLinkDB">
            <v-list-item
              v-for="(item, index) in dataSourceList"
              :key="index"
              active-class="box-glow"
              :value="item"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.host }}:{{ item.port }}/{{ item.dbName }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon size="35">$vuetify.icons.mysql</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-col>
    <v-col cols="12" lg="10">
      <v-card>
        <v-toolbar flat class="grey lighten-4">
          <v-toolbar-title>dataTable</v-toolbar-title>
          <div class="flex-grow-1" />
          <template v-if="$vuetify.breakpoint.smAndUp">
            <v-btn icon>
              <v-icon>mdi-export-variant</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-delete-circle</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
        </v-toolbar>
        <v-divider />
        <v-card-text class="tables">
          <v-list
            v-if="dataFlag"
            flat
          >
            <v-list-item
              v-for="(item, index) in dataTables"
              :key="index"
            >
              <v-list-item-action>
                <v-checkbox />
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title class="pb-1">{{ item.tableName }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-content>
                <v-list-item-title>{{ item.tableComment }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>{{ item.engine }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn fab x-small color="primary">
                  <v-icon>fa-cog</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn fab x-small color="info">
                  <v-icon>mdi-export-variant</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-row
            v-else
            class="fill-height"
            align-content="center"
            justify="center"
          >
            <v-col
              class="subtitle-1 text-center"
              cols="12"
            >
              加载table数据中...
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="deep-purple accent-4"
                indeterminate
                rounded
                height="6"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { linkDB } from '@/api/system/gen'
export default {
  data() {
    return {
      dataTables: [],
      dataSource: null,
      dataFlag: false,
      dataSourceList: [{
        name: '本地数据库1',
        dataSourceType: '1',
        dbName: 'yun-admin',
        host: '114.67.71.138',
        password: '123456',
        port: '3306',
        userName: 'lyj'
      }, {
        name: '本地数据库2',
        dataSourceType: '1',
        dbName: 'nacos',
        host: '114.67.71.138',
        password: '123456',
        port: '3306',
        userName: 'lyj'
      }]
    }
  },
  mounted() {
  },
  methods: {
    loadLinkDB() {
      this.dataFlag = false
      linkDB(this.dataSource).then(res => {
        if (res.data.code === 200) {
          this.dataFlag = true
          this.dataTables = res.data.data
        } else {
          this.message.error('连接失败')
        }
      })
    }
  }
}
</script>
<style lang="scss">
    .contact-nav-drawer{
        height: calc(100vh - 300px) !important;
    }
    .tables{
        height: calc(100vh - 365px);
        overflow-y: auto
    }
</style>
