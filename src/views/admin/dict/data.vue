<template>
  <div class="ma-4">
    <v-card class="br-6 box-shadow mt-3 pt-5">
      <v-card-title class="b-left">字典数据</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" xs="12" lg="12">
            <v-data-table
              v-model="selected"
              show-select
              :headers="dataTh"
              :items="dictDataList"
              hide-default-footer
              item-key="dictCode"
              no-data-text="没有数据!"
              :loading="dictDataFlag"
              loading-text="加载中... 请稍后！"
            >
              <template v-slot:top>
                <v-row>
                  <v-col cols="12" xs="12" sm="12" lg="5">
                    <v-btn rounded small color="success" @click="getDataList">
                      <v-icon dark>mdi-sync</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:dictData:add']"
                      rounded
                      class="ml-2"
                      small
                      color="primary"
                      @click="dataAddOrEdit({})"
                    >
                      <v-icon dark>add</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:dictType:edit']"
                      rounded
                      small
                      color="warning"
                      class="ml-2"
                      :disabled="selected.length!=1"
                      @click="dataAddOrEdit(selected[0])"
                    >
                      <v-icon dark>edit</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:dictType:del']"
                      small
                      rounded
                      color="error"
                      class="ml-2"
                      :disabled="selected.length<1"
                      @click="delData(selected)"
                    >
                      <v-icon dark>delete</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" lg="2">
                    <v-text-field
                      v-model="param.dictLabel"
                      label="标签"
                      class="small mt-n3"
                      outlined
                      clearable
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" lg="2">
                    <dict v-model="param.status" dict-type="dict_status" class="mt-n3" />
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" lg="2">
                    <dict-list-field v-model="param.dictType" class="mt-n3" />
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" lg="1" offset-xs="9">
                    <v-btn v-perms="['system:dictType:search']" small color="primary" dark @click="getDataList()">
                      <v-icon dark>search</v-icon>
                      搜索
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider />
              </template>
              <template v-slot:item.handle="{ item }">
                <v-btn v-perms="['system:dictData:edit']" fab x-small color="success" @click="dataAddOrEdit(item)">
                  <v-icon>fa fa-pencil</v-icon>
                </v-btn>
                <v-btn v-perms="['system:dictData:del']" color="error" fab x-small @click="delData(item)">
                  <v-icon dark>fa fa-trash-o</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!--字典data添加修改-->
    <v-form ref="dictData" :model="dictData">
      <v-dialog v-model="dataEditFlag" scrollable persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ !dataAddFlag?'修改字典项':'添加字典项' }}</span>
            <v-spacer />
            <v-btn class="mx-0" icon @click.stop="dataEditFlag = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>

              <v-row no-gutters>
                <v-col cols="12" lg="12" xs="12">
                  <v-text-field
                    v-model="dictData.dictLabel"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入标签!']"
                    label="字典标签"
                  />
                </v-col>
                <v-col cols="12" lg="12" xs="12">
                  <v-text-field
                    v-model="dictData.dictValue"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入名称!']"
                    label="字典键值"
                  />
                </v-col>
                <v-col cols="12" lg="6" xs="6">
                  <v-text-field
                    v-model="dictData.dictType"
                    class="small"
                    outlined
                    disabled
                    :rules="[v => !!v || '请输入字典类型!']"
                    label="字典类型"
                  />
                </v-col>
                <v-col cols="12" lg="5" xs="6" offset-lg="1">
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
                    class="mt-1 mb-5"
                  />
                </v-col>
                <v-col cols="12" lg="6" xs="6">
                  <v-text-field
                    v-model="dictData.dictSort"
                    class="small"
                    outlined
                    clearable
                    type="number"
                    :rules="[v => !!v || '请输入排序!']"
                    label="字典排序"
                  />
                </v-col>
                <v-col cols="12" lg="5" xs="6" offset-lg="1">
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
                    class="mt-1 mb-5"
                  />
                </v-col>

                <v-col cols="12" lg="12" xs="12" class="mt-3">
                  <v-textarea
                    v-model="dictData.remark"
                    outlined
                    name="remark"
                    label="备注"
                  />
                </v-col>
              </v-row>

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
  </div>
</template>

<script>
import { dictDataAddOrEdit, dictDataDel, dictDataList } from '@/api/system/dict'
import DictListField from '@/views/components/dict/dictListField'
export default {
  components: {
    DictListField
  },
  data() {
    return {
      dictDataList: [],
      selected: [],
      dataAddFlag: false,
      dataEditFlag: false,
      dictDataFlag: true,
      dictData: {},
      dataTh: [
        { text: '字典编码', align: 'center', sortable: true, value: 'dictCode' },
        { text: '字典标签', align: 'center', sortable: false, value: 'dictLabel' },
        { text: '字典键值', align: 'center', sortable: false, value: 'dictValue' },
        { text: '字典排序', align: 'center', sortable: true, value: 'dictSort' },
        { text: '备注', align: 'center', sortable: false, value: 'remark' },
        { text: '创建时间', align: 'center', sortable: true, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      param: {
        dictType: this.$route.params.dictType || ''
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    delData(data) {
      swal({
        title: '操作确认',
        text: '删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          const ids = data.map((n) => { return n.dictCode })
          dictDataDel(ids).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.getDataList(data.dictType)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    getDataList() {
      this.dictDataFlag = true
      dictDataList(this.param).then(res => {
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
        this.dictData.dictType = this.param.dictType
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
            this.$message.success(res.data.msg)
            this.dataEditFlag = false
            this.getDataList(this.dictData.dictType)
          } else {
            this.$message.error(res.data.msg)
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
