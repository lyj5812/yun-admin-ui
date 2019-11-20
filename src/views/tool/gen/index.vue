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
          <v-toolbar-title>
            <v-checkbox v-model="selAll" class="mt-5 ml-4" @change="selAll?selected=dataTables:selected=[]" />
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <template v-if="$vuetify.breakpoint.smAndUp">
            <v-btn fab x-small :disabled="selected.length<1" color="info" class="mr-5" @click="openGen(selected)">
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
                <v-btn fab x-small color="primary" @click="openEdit(item)">
                  <v-icon>fa-cog</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn fab x-small color="info" @click="openGen(item)">
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
    <v-dialog v-model="setFlag" scrollable max-width="80vw">
      <v-card>
        <v-card-title>
          <span class="title font-weight-bold">{{ table.tableComment }}</span>
          <v-spacer />
          <v-btn class="mx-0" icon @click.stop="setFlag = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-title>
          <v-row no-gutters class="grey lighten-4">
            <v-col cols="12" lg="1">
              <v-subheader>列名</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>注释</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>字段类型</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>java类型</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>java名</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>编辑</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>表格</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>查询</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>查询方式</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>是否必填</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>显示类型</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>字典类型</v-subheader>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row
            v-for="(item, index) in table.columns"
            :key="index"
            no-gutters
          >
            <v-col cols="12" lg="1">
              <v-subheader>{{ item.columnName }}</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-text-field
                v-model="item.columnComment"
                class="small mt-2"
                single-line
                outlined
              />
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>{{ item.columnType }}</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-select
                v-model="item.javaType"
                :items="['String','Integer','Long','Date','BigDecimal','Double']"
                class="small mt-2"
                :menu-props="{ offsetY: true }"
                single-line
                outlined
              />
            </v-col>
            <v-col cols="12" lg="1">
              <v-subheader>{{ item.columnCamelName }}</v-subheader>
            </v-col>
            <v-col cols="12" lg="1">
              <v-checkbox v-model="item.isEdit" color="primary" class="mx-5" />
            </v-col>
            <v-col cols="12" lg="1">
              <v-checkbox v-model="item.isList" color="primary" class="mx-5" />
            </v-col>
            <v-col cols="12" lg="1">
              <v-checkbox v-model="item.isQuery" color="primary" class="mx-5" />
            </v-col>
            <v-col cols="12" lg="1">
              <v-select
                v-model="item.queryType"
                :items="[{text:'=',value:'EQ'},{text:'!=',value:'NE'},{text:'>',value:'GT'},{text:'>=',value:'GTE'},{text:'<',value:'LT'},{text:'<=',value:'LTE'},{text:'like',value:'LIKE'}]"
                class="small mt-2"
                :menu-props="{ offsetY: true }"
                single-line
                outlined
              />
            </v-col>
            <v-col cols="12" lg="1">
              <v-checkbox v-model="item.isQuery" color="primary" class="mx-8" />
            </v-col>
            <v-col cols="12" lg="1">
              <v-select
                v-model="item.vueType"
                :items="[{text:'文本框',value:'input'},{text:'文本域',value:'textarea'},{text:'下拉框',value:'select'},{text:'复选框',value:'checkbox'},{text:'单选框',value:'radio'},{text:'日期控件',value:'datetime'}]"
                class="small mt-2 mx-2"
                :menu-props="{ offsetY: true }"
                single-line
                outlined
              />
            </v-col>
            <v-col cols="12" lg="1">
              <v-select
                v-model="item.queryType"
                :items="[{text:'=',value:'EQ'},{text:'!=',value:'NE'},{text:'>',value:'GT'},{text:'>=',value:'GTE'},{text:'<',value:'LT'},{text:'<=',value:'LTE'},{text:'like',value:'LIKE'}]"
                class="small mt-2  mx-2"
                :menu-props="{ offsetY: true }"
                single-line
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn small color="secondary" class="ml-2" @click="setFlag = false">
            <v-icon dark>close</v-icon>
            关闭
          </v-btn>
          <v-btn small color="info" @click="genCodeFlag=true">
            <v-icon dark>mdi-export-variant</v-icon>
            生成
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-form ref="generator" :model="generator">
      <v-dialog
        v-model="genCodeFlag"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="title font-weight-bold">生成代码</span>
            <v-spacer />
            <v-btn class="mx-0" icon @click.stop="genCodeFlag = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row no-gutters>
                <v-col cols="12" lg="12" sm="12" md="12">
                  <v-text-field
                    v-model="generator.author"
                    class="small"
                    label="作者 *"
                    placeholder="请输入作者！"
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
                        作者的名称，例：张三
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="12" sm="12" md="12">
                  <v-text-field
                    v-model="generator.packageName"
                    class="small"
                    label="包路径 *"
                    placeholder="请输入包路径！"
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
                        java文件包路径，例：com.lyj.system
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="12" sm="12" md="12">
                  <v-text-field
                    v-model="generator.moduleName"
                    class="small"
                    label="模块名称"
                    placeholder="请输入模块名称！"
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
                        模块的名称，例：system
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="12" sm="12" md="12">
                  <v-text-field
                    v-model="generator.subPore"
                    class="small"
                    label="表前缀"
                    placeholder="请输入截取的表前缀！"
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
                        截取表的前缀,默认不截取，例：sys_
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn small color="info" @click="downloadGenCode(table)">
              <v-icon dark>mdi-export-variant</v-icon>
              生成
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </v-row>
</template>

<script>
import { linkDB, genCode } from '@/api/system/gen'
export default {
  data() {
    return {
      dataTables: [],
      dataSource: null,
      dataFlag: false,
      selected: [],
      selAll: false,
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
      }],
      setFlag: false,
      genCodeFlag: false,
      generator: {},
      table: {}
    }
  },
  methods: {
    loadLinkDB() {
      this.dataFlag = false
      this.selected = []
      this.selAll = false
      linkDB(this.dataSource).then(res => {
        if (res.data.code === 200) {
          this.dataFlag = true
          this.dataTables = res.data.data
        } else {
          this.message.error('连接失败')
        }
      })
    },
    openEdit(item) {
      this.table = item
      this.setFlag = true
    },
    openGen(item) {
      this.table = item
      this.genCodeFlag = true
    },
    downloadGenCode(tables) {
      if (this.$refs.generator.validate()) {
        this.generator.tables = tables
        genCode(this.generator)
      } else {
        console.log('error submit!!')
        return false
      }
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
