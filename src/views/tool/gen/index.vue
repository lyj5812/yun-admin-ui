<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="2">
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
                <v-btn class="mx-2" fab dark x-small color="primary" @click="addOrEditSource({port:3306})">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-toolbar>
        <v-list dense nav class="mt-1 inner-sidebar v-menu-trans-list-npd">
          <v-list-item-group v-model="dataSource" mandatory color="primary" @change="loadLinkDB">
            <v-list-item
              v-for="(item, index) in dataSourceList"
              :key="index"
              :value="item"
              @contextmenu="show"
              @contextmenu.prevent="selecte(item)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.name" />
                <v-list-item-subtitle>
                  {{ item.host }}:{{ item.port }}/{{ item.dbName }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="show">
                  <v-icon color="grey lighten-1">mdi-dots-horizontal</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-menu
          v-model="showMenu"
          :position-x="x"
          :position-y="y"
          absolute
          transition="scale-transition"
          offset-y
        >
          <v-list dense>
            <v-list-item @click="addOrEditSource(source)">
              <v-list-item-title>编辑</v-list-item-title>
            </v-list-item>
            <v-list-item @click="closeOthersTags()">
              <v-list-item-title>删除</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="12" lg="10">
        <v-card>
          <v-toolbar flat class="grey lighten-4">
            <v-toolbar-title>
              <v-checkbox v-model="selAll" class="mt-5 ml-4" @change="selAll?selected=dataTables:selected=[]" />
            </v-toolbar-title>
            <div class="flex-grow-1" />
            <template v-if="$vuetify.breakpoint.smAndUp">
              <v-btn fab x-small :disabled="selected.length<1" color="info" class="mr-5" @click="downloadGenCode(selected)">
                <v-icon>mdi-export-variant</v-icon>
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
                  <v-checkbox v-model="selected" :value="item" />
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
                  <v-btn fab x-small color="primary" @click="toEdit(item)">
                    <v-icon>fa-cog</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn fab x-small color="info" @click="downloadGenCode([item])">
                    <v-icon>mdi-export-variant</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-row
              v-else
              class="fill-height"
              align="center"
              justify="center"
            >
              <v-col cols="3">
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
      <v-form ref="source" :model="source">
        <v-dialog
          v-model="addFlag"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="title font-weight-bold">添加数据源</span>
              <v-spacer />
              <v-btn class="mx-0" icon @click.stop="addFlag = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row no-gutters>
                  <v-col cols="12" lg="12" sm="12" md="12">
                    <v-text-field
                      v-model="source.name"
                      dense
                      label="数据源名称"
                      placeholder="请输入名称！"
                      clearable
                      outlined
                    >
                      <template v-slot:prepend>
                        <v-tooltip
                          bottom
                        >
                          <template v-slot:activator="{ on }">
                            <v-icon class="my-2" v-on="on">mdi-help-circle-outline</v-icon>
                          </template>
                          数据源名称
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12" sm="12" md="12">
                    <v-text-field
                      v-model="source.dbName"
                      dense
                      label="数据库名称"
                      placeholder="请输入名称！"
                      clearable
                      outlined
                    >
                      <template v-slot:prepend>
                        <v-tooltip
                          bottom
                        >
                          <template v-slot:activator="{ on }">
                            <v-icon class="my-2" v-on="on">mdi-help-circle-outline</v-icon>
                          </template>
                          数据源名称
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12" sm="12" md="12">
                    <v-text-field
                      v-model="source.host"
                      dense
                      label="host地址"
                      placeholder="请输入host地址！"
                      clearable
                      outlined
                    >
                      <template v-slot:prepend>
                        <v-tooltip
                          bottom
                        >
                          <template v-slot:activator="{ on }">
                            <v-icon class="my-2" v-on="on">mdi-help-circle-outline</v-icon>
                          </template>
                          数据源的地址
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12" sm="12" md="12">
                    <v-text-field
                      v-model="source.port"
                      dense
                      label="端口号"
                      placeholder="请输入端口号！"
                      clearable
                      outlined
                    >
                      <template v-slot:prepend>
                        <v-tooltip
                          bottom
                        >
                          <template v-slot:activator="{ on }">
                            <v-icon class="my-2" v-on="on">mdi-help-circle-outline</v-icon>
                          </template>
                          数据源端口号
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12" sm="12" md="12">
                    <v-text-field
                      v-model="source.userName"
                      dense
                      label="用户名"
                      placeholder="请输入用户名！"
                      clearable
                      outlined
                    >
                      <template v-slot:prepend>
                        <v-tooltip
                          bottom
                        >
                          <template v-slot:activator="{ on }">
                            <v-icon class="my-2" v-on="on">mdi-help-circle-outline</v-icon>
                          </template>
                          数据源用户名
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12" sm="12" md="12">
                    <v-text-field
                      v-model="source.password"
                      dense
                      label="密码"
                      placeholder="请输入密码！"
                      clearable
                      outlined
                    >
                      <template v-slot:prepend>
                        <v-tooltip
                          bottom
                        >
                          <template v-slot:activator="{ on }">
                            <v-icon class="my-2" v-on="on">mdi-help-circle-outline</v-icon>
                          </template>
                          数据源密码
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn small color="info" @click="addSourceSubmit()">
                <v-icon dark>mdi-export-variant</v-icon>
                添加
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import { getTableList, genCode, addSource, getSourceList } from '@/api/tool/gen'
export default {
  data() {
    return {
      dataTables: [],
      showMenu: false,
      x: 0,
      y: 0,
      dataSource: null,
      dataFlag: false,
      addFlag: false,
      selected: [],
      selAll: false,
      source: {},
      dataSourceList: [],
      setFlag: false,
      genCodeFlag: false,
      generator: {},
      table: {}
    }
  },
  created() {
    this.loadSourceList()
  },
  methods: {
    loadSourceList() {
      getSourceList().then(res => {
        this.dataSourceList = res.data.data
      })
    },
    loadLinkDB() {
      this.dataFlag = false
      this.selected = []
      this.selAll = false
      getTableList(this.dataSource.sourceId).then(res => {
        if (res.data.code === 200) {
          this.dataFlag = true
          this.dataTables = res.data.data
        } else {
          this.$message.error('连接失败')
        }
      })
    },
    show(e) {
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
    selecte(item) {
      this.source = item
    },
    addOrEditSource(item) {
      this.source = item
      this.addFlag = true
    },
    addSourceSubmit() {
      if (this.$refs.source.validate()) {
        addSource(this.source).then(res => {
          this.$message.success(res.data.msg)
          this.addFlag = false
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    toEdit(item) {
      this.$router.push({
        path: `/gen/${this.dataSource.sourceId}/${item.tableName}`
      })
    },
    downloadGenCode(tables) {
      const tableNames = tables.map((n) => { return n.tableName })
      genCode(this.dataSource.sourceId, tableNames)
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
