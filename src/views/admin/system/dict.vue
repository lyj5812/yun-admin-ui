<template>
  <v-row>
    <v-col xs="12" lg="12">
      <v-card class="elevation-4">
        <v-row class="pa-5 ml-3">
          <v-col xs="12" lg="2">
            <v-text-field
              v-model="page.dictName"
              label="字典名称"
              class="small"
              outlined
              clearable
              hide-details
            />
          </v-col>
          <v-col xs="12" lg="2" offset-lg="1">
            <v-text-field
              v-model="page.dictType"
              label="字典类型"
              class="small"
              outlined
              clearable
              hide-details
            />
          </v-col>

          <v-col xs="12" lg="2" offset-lg="1">
            <dict v-model="page.status" dict-type="dict_status" />
          </v-col>

          <v-col xs="12" lg="2" offset-lg="1" offset-xs="9">
            <v-btn v-perms="['system:dictType:search']" small color="primary" class="mt-1" dark @click="dictTypeListPageData()">
              <v-icon dark>search</v-icon>
              搜索
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col xs="12">
      <v-card class="elevation-4">
        <v-data-table
          v-model="selected"
          :headers="th"
          :items="dictTypePage.records"
          hide-default-footer
          show-select
          :single-expand="true"
          :expanded.sync="expanded"
          show-expand
          item-key="dictId"
          no-data-text="没有数据!"
          :loading="dataFlag"
          loading-text="加载中... 请稍后！"
          @item-expanded="openDictData"
        >
          <template v-if="dictTypePage.records&&dictTypePage.records.length===0" v-slot:body>
            <td :colspan="th.length+1">
              <v-row justify="center">
                <v-img max-height="200" class="ma-4" max-width="200" :src="require('@/assets/images/table/no-data.svg')" />
              </v-row>
            </td>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn v-perms="['system:dictType:add']" small color="primary" @click="addOrEdit({})">
                <v-icon dark>add</v-icon>
                添加
              </v-btn>
              <v-btn
                v-perms="['system:dictType:edit']"
                small
                color="warning"
                class="ml-2"
                :disabled="selected.length!=1"
                @click="addOrEdit(selected[0])"
              >
                <v-icon dark>edit</v-icon>
                修改
              </v-btn>
              <v-btn
                v-perms="['system:dictType:del']"
                small
                color="error"
                class="ml-2"
                :disabled="selected.length<1"
                @click="delTypes(selected)"
              >
                <v-icon dark>delete</v-icon>
                删除
              </v-btn>
            </v-toolbar>
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
          <template v-slot:item.handle="{ item }">
            <v-btn v-perms="['system:dictType:add']" small icon class="mt-2 mb-2" color="warning" @click="addOrEdit(item)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn v-perms="['system:dictType:edit']" small icon class="mt-2 mb-2" color="error" @click="delTypes([item])">
              <v-icon dark>delete</v-icon>
            </v-btn>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn v-perms="['system:dictData:add']" small icon class="mt-2 mb-2" color="primary" v-on="on" @click="dataAddOrEdit(item)">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </template>
              <span>添加项</span>
            </v-tooltip>
          </template>
          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length">
              <v-card color="#e4e5e8" class="white&#45;&#45;text">
                <v-card-text>
                  <v-data-table
                    :headers="dataTh"
                    :items="dictDataList"
                    hide-default-footer
                    item-key="dictCode"
                    no-data-text="没有数据!"
                  >
                    <template v-slot:item.handle="{ item }">
                      <v-btn v-perms="['system:dictData:edit']" small text icon color="warning" @click="dataAddOrEdit(item)">
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <v-btn v-perms="['system:dictData:del']" color="error" small text icon @click="delData(item)">
                        <v-icon dark>delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card-text>
                <v-overlay absolute :value="dictDataFlag">
                  加载中&nbsp;<v-progress-circular indeterminate color="primary" />
                </v-overlay>
              </v-card>
            </td>
          </template>
        </v-data-table>
        <pagination
          :page-sizes="[2,20]"
          :page-data="dictTypePage"
          @pageChange="dictTypeListPage"
        />
      </v-card>
    </v-col>
    <!--字典type添加修改-->
    <v-form ref="dictType" :model="dictType">
      <v-dialog v-model="editFlag" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dictType.dictType?'修改字典':'添加字典' }}</span>
          </v-card-title>
          <v-card-text>
            <v-layout wrap mt-4>
              <v-flex lg12 xs12>
                <v-text-field
                  v-model="dictType.dictName"
                  class="small"
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入名称!']"
                  label="字典名称"
                />
              </v-flex>
              <v-flex lg6 xs6>
                <v-text-field
                  v-model="dictType.dictType"
                  class="small"
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入字典类型!']"
                  label="字典类型"
                />
              </v-flex>
              <v-flex lg6 xs6>
                <v-switch
                  v-model="dictType.status"
                  label="状态正常"
                  color="primary"
                  value="0"
                  inset
                  :rules="[v => !!v || '请输入状态!']"
                  false-value="1"
                  true-value="0"
                  hide-details
                  class="mt-1 ml-5"
                />
              </v-flex>
              <v-flex lg12 xs12>
                <v-textarea
                  v-model="dictType.remark"
                  outlined
                  name="remark"
                  label="备注"
                />
              </v-flex>
            </v-layout>

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
    <!--字典data添加修改-->
    <v-form ref="dictData" :model="dictData">
      <v-dialog v-model="dataEditFlag" scrollable persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ !dataAddFlag?'修改字典项':'添加字典项' }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>

              <v-layout wrap>
                <v-flex lg12 xs12>
                  <v-text-field
                    v-model="dictData.dictLabel"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入标签!']"
                    label="字典标签"
                  />
                </v-flex>
                <v-flex lg12 xs12>
                  <v-text-field
                    v-model="dictData.dictValue"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入名称!']"
                    label="字典键值"
                  />
                </v-flex>
                <v-flex lg6 xs6>
                  <v-text-field
                    v-model="dictData.dictType"
                    class="small"
                    outlined
                    disabled
                    :rules="[v => !!v || '请输入字典类型!']"
                    label="字典类型"
                  />
                </v-flex>
                <v-flex lg6 xs6>
                  <v-switch
                    v-model="dictData.status"
                    label="状态正常"
                    color="primary"
                    value="0"
                    inset
                    :rules="[v => !!v || '请输入状态!']"
                    false-value="1"
                    true-value="0"
                    hide-details
                    class="mt-1 ml-5"
                  />
                </v-flex>
                <v-flex lg6 xs6>
                  <v-text-field
                    v-model="dictData.dictSort"
                    class="small"
                    outlined
                    clearable
                    type="number"
                    :rules="[v => !!v || '请输入排序!']"
                    label="字典排序"
                  />
                </v-flex>
                <v-flex lg6 xs6>
                  <v-switch
                    v-model="dictData.isDefault"
                    label="系统默认"
                    color="primary"
                    value="0"
                    inset
                    :rules="[v => !!v || '请输入!']"
                    false-value="N"
                    true-value="Y"
                    hide-details
                    class="mt-1 ml-5"
                  />
                </v-flex>

                <v-flex xs12 mt-3>
                  <v-textarea
                    v-model="dictData.remark"
                    outlined
                    name="remark"
                    label="备注"
                  />
                </v-flex>
              </v-layout>

            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn small color="success" @click="dataAddOrEditSubmit()">
              <v-icon dark>done</v-icon>
              提交
            </v-btn>
            <v-btn small color="secondary" class="ml-2" @click="dataEditFlag=false">
              <v-icon dark>close</v-icon>
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </v-row>
</template>

<script>
import {
  dictTypeListPage,
  dictTypeAddOrEdit,
  dictDataAddOrEdit,
  dictTypeDelList,
  dictDataDel,
  dictDataList
} from '@/api/system/dict'

export default {
  data() {
    return {
      dictTypePage: [],
      dictDataList: [],
      expanded: [],
      selected: [],
      dataAddFlag: false,
      editFlag: false,
      dataEditFlag: false,
      dataFlag: true,
      dictDataFlag: true,
      dictType: {},
      dictData: {},
      th: [
        { text: '字典编号', align: 'center', sortable: true, value: 'dictId' },
        { text: '字典名称', align: 'center', sortable: false, value: 'dictName' },
        { text: '字典类型', align: 'center', sortable: false, value: 'dictType' },
        { text: '状态', align: 'center', sortable: true, value: 'status' },
        { text: '备注', align: 'center', sortable: false, value: 'remark' },
        { text: '创建时间', align: 'center', sortable: true, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      dataTh: [
        { text: '字典编码', align: 'center', sortable: true, value: 'dictCode' },
        { text: '字典标签', align: 'center', sortable: false, value: 'dictLabel' },
        { text: '字典键值', align: 'center', sortable: false, value: 'dictValue' },
        { text: '字典排序', align: 'center', sortable: true, value: 'dictSort' },
        { text: '备注', align: 'center', sortable: false, value: 'remark' },
        { text: '创建时间', align: 'center', sortable: true, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      page: {
        current: 1,
        size: 10,
        dictName: null,
        dictType: null,
        status: null
      }

    }
  },
  mounted() {
    this.dictTypeListPage(this.page)
  },
  methods: {
    /**
       * 字典分页数据
       */
    dictTypeListPage(page) {
      this.page.size = page.size
      this.page.current = page.current
      this.dictTypeListPageData()
    },
    /**
       * 字典分页数据
       */
    dictTypeListPageData() {
      this.dataFlag = true
      dictTypeListPage(this.page).then(res => {
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
            this.message.success(res.data.msg)
            this.editFlag = false
            this.dictTypeListPage(this.dictTypePage)
          } else {
            this.message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    delTypes(types) {
      // eslint-disable-next-line no-undef
      swal({
        title: '操作确认',
        text: '删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          dictTypeDelList(types).then(res => {
            if (res.data.code === 200) {
              this.message.success(res.data.msg)
              this.delFlag = false
              this.dictTypeListPage(this.dictTypePage)
            } else {
              this.message.error(res.data.msg)
            }
          })
        }
      })
    },
    delData(data) {
      // eslint-disable-next-line no-undef
      swal({
        title: '操作确认',
        text: '删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          dictDataDel(data).then(res => {
            if (res.data.code === 200) {
              this.message.success(res.data.msg)
              this.getDataList(data.dictType)
            } else {
              this.message.error(res.data.msg)
            }
          })
        }
      })
    },
    openDictData(item) {
      this.getDataList(item.item.dictType)
    },
    getDataList(dictType) {
      this.dictDataFlag = true
      dictDataList(dictType).then(res => {
        this.dictDataList = res.data.data
        this.dictDataFlag = false
      })
    },
    dataAddOrEdit(item) {
      this.dataEditFlag = true
      this.dataAddFlag = false
      if (!item.dictCode) {
        this.dataAddFlag = true
        this.$refs.dictData.resetValidation()
        this.dictData = {}
        this.dictData.dictType = item.dictType
        this.dictData.isDefault = 'Y'
        this.dictData.status = '0'
      } else {
        this.dictData = item
      }
    },
    dataAddOrEditSubmit() {
      if (this.$refs.dictData.validate()) {
        dictDataAddOrEdit(this.dictData).then(res => {
          if (res.data.code === 200) {
            this.message.success(res.data.msg)
            this.dataEditFlag = false
            this.getDataList(this.dictData.dictType)
          } else {
            this.message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    }
  }
}
</script>
