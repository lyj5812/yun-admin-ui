<template>
  <v-container>
    <v-card class="br-6 box-shadow mt-3 pt-5">
      <v-card-title class="b-left">字典列表</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" xs="12" lg="12">
            <v-data-table
              v-model="selected"
              :headers="th"
              :items="dictTypePage.records"
              hide-default-footer
              disable-pagination
              show-select
              item-key="dictId"
              no-data-text="没有数据!"
              :loading="dataFlag"
              loading-text="加载中... 请稍后！"
            >
              <template v-if="dictTypePage.records&&dictTypePage.records.length===0" v-slot:body>
                <td :colspan="th.length+1">
                  <v-row justify="center">
                    <v-img max-height="200" class="ma-4" max-width="200" :src="require('@/assets/img/no-data.svg')" />
                  </v-row>
                </td>
              </template>
              <template v-slot:top>
                <v-row>
                  <v-col
                    cols="auto"
                    class="mr-auto"
                  >
                    <v-btn fab x-small color="success" @click="dictTypeListPageData">
                      <v-icon dark>mdi-sync</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:dictType:add']"
                      class="ml-2"
                      x-small
                      fab
                      color="primary"
                      @click="addOrEdit({})"
                    >
                      <v-icon dark>add</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:dictType:edit']"
                      fab
                      x-small
                      color="warning"
                      class="ml-2"
                      :disabled="selected.length!=1"
                      @click="addOrEdit(selected[0])"
                    >
                      <v-icon dark>edit</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:dictType:del']"
                      x-small
                      fab
                      color="error"
                      class="ml-2"
                      :disabled="selected.length<1"
                      @click="delTypes(selected)"
                    >
                      <v-icon dark>delete</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn v-perms="['system:dictType:search']" small text color="primary" dark @click="filterFlag=!filterFlag">
                      筛选
                      <v-icon dark>{{ filterFlag?'mdi-chevron-double-up':'mdi-chevron-double-down' }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider />
                <v-expand-transition>
                  <div v-show="filterFlag">
                    <v-row class="pt-5" dense>
                      <v-col cols="12" xs="12" sm="12" lg="2">
                        <v-text-field
                          v-model="param.dictName"
                          label="字典名称"
                          outlined
                          dense
                          clearable
                          hide-details
                        />
                      </v-col>
                      <v-col cols="12" xs="12" lg="2" sm="12">
                        <v-text-field
                          v-model="param.dictType"
                          label="字典类型"
                          outlined
                          dense
                          clearable
                          hide-details
                        />
                      </v-col>

                      <v-col cols="12" xs="12" sm="12" lg="2">
                        <dict
                          v-model="param.status"
                          outlined
                          dense
                          clearable
                          dict-type="dict_status"
                        />
                      </v-col>

                      <v-col cols="12" xs="12" sm="12" lg="2">
                        <y-date-picker
                          ref="date"
                          v-model="dates"
                          outlined
                          clearable
                          show-time
                          range
                          label="创建时间"
                          prepend-inner-icon="event"
                          dense
                        >
                          <v-spacer />
                          <v-btn text color="primary" @click="$refs.date.menu=false">确认</v-btn>
                        </y-date-picker>
                      </v-col>
                      <v-col cols="12" xs="12" sm="12" lg="1" offset-xs="9">
                        <v-btn v-perms="['system:dictType:search']" color="primary" dark @click="dictTypeListPageData()">
                          <v-icon dark>search</v-icon>
                          搜索
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider />
                  </div>
                </v-expand-transition>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item.status==0"
                  class="ma-2"
                  small
                  color="green"
                  label
                  outlined
                >
                  正常
                </v-chip>
                <v-chip
                  v-else
                  class="ma-2"
                  small
                  color="red"
                  label
                  outlined
                >
                  停用
                </v-chip>
              </template>
              <template v-slot:item.dictType="{ item }">
                <router-link :to="'/dictData/' + item.dictType" class="link-type">
                  <span>{{ item.dictType }}</span>
                </router-link>
              </template>
              <template v-slot:item.handle="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-perms="['system:dictType:edit']" fab x-small class="ma-1" color="success" v-on="on" @click="addOrEdit(item)">
                      <v-icon dark>edit</v-icon>
                    </v-btn>
                  </template>
                  修改
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-perms="['system:dictType:del']" fab x-small class="ma-1" color="error" v-on="on" @click="delTypes([item])">
                      <v-icon dark>delete</v-icon>
                    </v-btn>
                  </template>
                  删除
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <pagination
          :page-sizes="[10,20]"
          :page-data="dictTypePage"
          @pageChange="dictTypeListPage"
        />
      </v-card-text>
    </v-card>
    <!--字典type添加修改-->
    <v-form ref="dictType" :model="dictType">
      <v-dialog v-model="editFlag" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dictType.dictType?'修改字典':'添加字典' }}</span>
            <v-spacer />
            <v-btn class="mx-0" icon @click.stop="editFlag = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" lg="12" xs="12">
                <v-text-field
                  v-model="dictType.dictName"
                  class="small"
                  outlined
                  dense
                  clearable
                  :rules="[v => !!v || '请输入名称!']"
                  label="字典名称"
                />
              </v-col>
              <v-col cols="12" lg="6" xs="6">
                <v-text-field
                  v-model="dictType.dictType"
                  class="small"
                  outlined
                  dense
                  clearable
                  :rules="[v => !!v || '请输入字典类型!']"
                  label="字典类型"
                />
              </v-col>
              <v-col cols="12" lg="5" xs="5" offset-lg="1">
                <v-switch
                  v-model="dictType.status"
                  class="mt-1 mb-5"
                  label="状态正常"
                  color="primary"
                  value="0"
                  dense
                  inset
                  :rules="[v => !!v || '请输入状态!']"
                  false-value="1"
                  true-value="0"
                  hide-details
                />
              </v-col>
              <v-col cols="12" lg="12" xs="12">
                <v-textarea
                  v-model="dictType.remark"
                  outlined
                  dense
                  name="remark"
                  label="备注"
                />
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn small color="success" @click="addOrEditSubmit()">
              <v-icon dark>done</v-icon>
              提交
            </v-btn>
            <v-btn small color="secondary" class="ml-2" @click="editFlag=false">
              <v-icon dark>close</v-icon>
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </v-container>
</template>

<script>
import { dictTypeListPage, dictTypeAddOrEdit, dictTypeDelList } from '@/api/system/dict'
import YDatePicker from '@/components/YDatePicker'
export default {
  components: {
    YDatePicker
  },
  data() {
    return {
      dictTypePage: {},
      selected: [],
      dataFlag: true,
      filterFlag: false,
      editFlag: false,
      startMenu: false,
      dictType: {},
      th: [
        { text: '字典编号', align: 'center', sortable: true, value: 'dictId' },
        { text: '字典名称', align: 'center', sortable: false, value: 'dictName' },
        { text: '字典类型', align: 'center', sortable: false, value: 'dictType' },
        { text: '状态', align: 'center', sortable: false, value: 'status' },
        { text: '备注', align: 'center', sortable: false, value: 'remark' },
        { text: '创建时间', align: 'center', sortable: true, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      dates: [],
      param: {
        current: 1,
        size: 10,
        dictName: null,
        dictType: null,
        status: null
      }

    }
  },
  mounted() {
    this.dictTypeListPage(this.param)
  },
  methods: {
    /**
       * 字典分页数据
       */
    dictTypeListPage(page) {
      this.param.size = page.size
      this.param.current = page.current
      this.dictTypeListPageData()
    },
    /**
       * 字典分页数据
       */
    dictTypeListPageData() {
      this.dataFlag = true
      dictTypeListPage(this.param).then(res => {
        this.dictTypePage = res.data.data
        this.dataFlag = false
      })
    },
    /**
       * 打开模态框
       */
    addOrEdit(item) {
      this.dictType = item
      if (!this.dictType.dictId) {
        this.$refs.dictType.resetValidation()
        this.dictType.status = '0'
      }
      this.editFlag = true
    },
    /**
       * 添加或者修改提交
       * @returns {boolean}
       */
    addOrEditSubmit() {
      if (this.$refs.dictType.validate()) {
        dictTypeAddOrEdit(this.dictType).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.editFlag = false
            this.dictTypeListPage(this.dictTypePage)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    delTypes(types) {
      this.$confirm.fire({
        title: '操作确认?',
        text: '删除后，您将无法恢复！',
        icon: 'warning'
      }).then((result) => {
        if (result.value) {
          const ids = types.map((n) => { return n.dictId })
          dictTypeDelList(ids).then(res => {
            if (res.data.code === 200) {
              this.$confirm.fire(
                '删除成功!',
                '您要删除的已删除.',
                'success'
              )
              this.dictTypeListPage(this.dictTypePage)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
