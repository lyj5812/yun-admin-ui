<template>
  <v-container>
    <v-tabs v-model="tab">
      <v-tab href="#tab-1">生成配置</v-tab>
      <v-tab href="#tab-2">列配置</v-tab>
    </v-tabs>
    <v-card class="br-6 box-shadow mt-3 pt-5">
      <v-tabs-items v-model="tab">
        <v-tab-item
          value="tab-1"
        >
          <v-row no-gutters class="pa-4" align-content="center">
            <v-col cols="12" lg="5" offset-lg="1" sm="12" md="12" class="pl-8">
              <v-text-field
                v-model="tableInfo.tableName"
                disabled
                dense
                label="表名称"
                outlined
              />
            </v-col>
            <v-col cols="12" lg="5" offset-lg="1" sm="12" md="12">
              <v-text-field
                v-model="tableInfo.functionName"
                dense
                label="功能名称"
                placeholder="请输入功能名称！"
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
                    表的业务名称
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" lg="5" offset-lg="1" sm="12" md="12">
              <v-text-field
                v-model="tableInfo.className"
                dense
                label="实体类名"
                placeholder="请输入实体类名！"
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
                    实体类名
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" lg="5" offset-lg="1" sm="12" md="12">
              <v-text-field
                v-model="tableInfo.author"
                dense
                label="作者"
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
                    代码作者
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" lg="5" offset-lg="1" sm="12" md="12">
              <v-text-field
                v-model="tableInfo.packageName"
                dense
                label="包路径"
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
                    代码包生成路径
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" lg="5" offset-lg="1" sm="12" md="12">
              <v-text-field
                v-model="tableInfo.moduleName"
                dense
                label="模块名"
                placeholder="请输入模块名！"
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
            <v-col cols="12" lg="5" offset-lg="1" sm="12" md="12">
              <v-text-field
                v-model="tableInfo.businessName"
                dense
                label="业务名"
                placeholder="请输入业务名！"
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
                    业务名称
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item
          value="tab-2"
        >
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
          <v-card-text class="tables">
            <v-row
              v-for="(item, index) in tableInfo.columns"
              :key="index"
              no-gutters
            >
              <v-col cols="12" lg="1">
                <v-subheader>{{ item.columnName }}</v-subheader>
              </v-col>
              <v-col cols="12" lg="1">
                <v-subheader>{{ item.columnComment }}</v-subheader>
              </v-col>
              <v-col cols="12" lg="1">
                <v-subheader>{{ item.columnType }}</v-subheader>
              </v-col>
              <v-col cols="12" lg="1">
                <v-select
                  v-model="item.javaType"
                  :items="['String','Integer','Long','Date','BigDecimal','Double']"
                  dense
                  :menu-props="{ offsetY: true }"
                  single-line
                  outlined
                />
              </v-col>
              <v-col cols="12" lg="1">
                <v-subheader>{{ item.columnCamelName }}</v-subheader>
              </v-col>
              <v-col cols="12" lg="1">
                <v-checkbox v-model="item.isEdit" color="primary" class="mx-5 mt-2" />
              </v-col>
              <v-col cols="12" lg="1">
                <v-checkbox v-model="item.isList" color="primary" class="mx-5 mt-2" />
              </v-col>
              <v-col cols="12" lg="1">
                <v-checkbox v-model="item.isQuery" color="primary" class="mx-5 mt-2" />
              </v-col>
              <v-col cols="12" lg="1">
                <v-select
                  v-model="item.queryType"
                  :items="[{text:'=',value:'EQ'},{text:'!=',value:'NE'},{text:'>',value:'GT'},{text:'>=',value:'GTE'},{text:'<',value:'LT'},{text:'<=',value:'LTE'},{text:'like',value:'LIKE'}]"
                  dense
                  :menu-props="{ offsetY: true }"
                  single-line
                  outlined
                />
              </v-col>
              <v-col cols="12" lg="1">
                <v-checkbox v-model="item.isRequired" color="primary" class="mx-8 mt-2" />
              </v-col>
              <v-col cols="12" lg="1">
                <v-select
                  v-model="item.vueType"
                  :items="[{text:'文本框',value:'input'},{text:'文本域',value:'textarea'},{text:'下拉框',value:'select'},{text:'复选框',value:'checkbox'},{text:'单选框',value:'radio'},{text:'日期控件',value:'datetime'}]"
                  class="mx-2"
                  dense
                  :menu-props="{ offsetY: true }"
                  single-line
                  outlined
                />
              </v-col>
              <v-col cols="12" lg="1">
                <dict-list-field v-model="item.dictType" dense class="mx-2" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-tab-item>

        <v-card-actions>
          <v-spacer />
          <v-btn small color="success" @click="editSubmit()">
            <v-icon dark>done</v-icon>
            提交
          </v-btn>
          <v-btn small color="secondary" class="ml-2" @click="closeSelectedTag">
            <v-icon dark>close</v-icon>
            关闭
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-tabs-items></v-card>
  </v-container>
</template>

<script>
import { getTableInfo, editTableInfo } from '@/api/tool/gen'
import DictListField from '@/views/components/dict/dictListField'
export default {
  components: {
    DictListField
  },
  data() {
    return {
      dataTables: [],
      dataFlag: false,
      selected: [],
      tab: 'tab-2',
      setFlag: false,
      genCodeFlag: false,
      generator: {},
      tableInfo: {}
    }
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      const data = {
        sourceId: this.$route.params.sourceId,
        tableName: this.$route.params.tableName
      }
      getTableInfo(data).then(res => {
        this.tableInfo = res.data.data
      })
    },
    editSubmit() {
      editTableInfo(
        this.$route.params.sourceId,
        this.$route.params.tableName,
        this.tableInfo
      ).then(res => {
        this.$message.success('修改成功')
      })
    },
    closeSelectedTag() {
      this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
<style lang="scss">
    .tables{
        height: calc(100vh - 345px);
        overflow-y: auto
    }
</style>
