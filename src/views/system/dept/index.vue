<template>
  <v-container>
    <v-card class="br-6 mx-4 mt-3 box-shadow pt-3">
      <v-card-title class="b-left mb-3">部门列表</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="auto" class="mr-auto">
            <v-text-field
              v-model="search"
              label="搜索"
              dense
              outlined
              clearable
              hide-details
              prepend-inner-icon="search"
            />

          </v-col>
          <v-col>
            <v-btn color="primary" @click="openOrClose()">
              <v-icon small dark>
                mdi-arrow-expand-vertical
              </v-icon>
              展开/收缩
            </v-btn>
          </v-col>
        </v-row>
        <tree-table
          ref="treeTb"
          :search="search"
          :headers="headers"
          :items="deptList"
          item-key="deptId"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              v-if="item.status==0"
              small
              color="green"
              label
              dark
            >
              正常
            </v-chip>
            <v-chip
              v-else
              small
              color="red"
              dark
              label
            >
              关闭
            </v-chip>
          </template>
          <template v-slot:item.handle="{ item }">
            <v-btn v-perms="['system:dept:edit']" fab x-small color="success" class="ma-1" @click="editDept(item)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn v-perms="['system:dept:del']" fab x-small class="ma-1" color="error" @click="delDept(item)">
              <v-icon dark>delete</v-icon>
            </v-btn>
            <v-btn v-perms="['system:dept:add']" fab x-small class="ma-1" color="primary" @click="addDept(item)">
              <v-icon dark>add</v-icon>
            </v-btn>
          </template>
        </tree-table>
      </v-card-text>
    </v-card>
    <!--菜单添加修改-->
    <v-form ref="dept" :model="dept">
      <v-dialog v-model="editFlag" scrollable persistent max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dept.deptId?'编辑部门':'添加部门' }}</span>
            <v-spacer />
            <v-btn class="mx-0" icon @click.stop="editFlag = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row class="pa-5" no-gutters>
              <v-col
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-model="dept.parentId"
                  disabled
                  label="父部门ID"
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <small class="red--text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-model="dept.deptId"
                  disabled
                  label="部门ID"
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <small class="red--text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-model="dept.deptName"
                  :rules="[v => !!v || '请输入名称!']"
                  label="部门名称"
                  dense
                  outlined
                  clearable
                >
                  <template v-slot:prepend>
                    <small class="red--text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-model="dept.leader"
                  label="负责人"
                  class="ml-4"
                  dense
                  outlined
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-model="dept.phone"
                  label="联系电话"
                  class="ml-4"
                  dense
                  outlined
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-model="dept.email"
                  label="邮箱"
                  class="ml-4"
                  dense
                  outlined
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-text-field
                  v-model="dept.orderNum"
                  label="排序号"
                  type="number"
                  class="ml-4"
                  dense
                  outlined
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-radio-group
                  v-model="dept.status"
                  label="部门状态"
                  class="mt-2 ml-5"
                  :rules="[v => !!v || '请选择状态!']"
                  row
                >
                  <v-radio
                    label="正常"
                    color="orange darken-2"
                    value="0"
                  />
                  <v-radio
                    label="停用"
                    color="indigo"
                    value="1"
                  />
                </v-radio-group>
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
import { deptAddOrEdit, delDept, deptList } from '@/api/system/dept'
import TreeTable from '@/components/TreeTable'
export default {
  components: {
    TreeTable
  },
  data() {
    return {
      dept: {},
      editFlag: false,
      search: null,
      headers: [
        { text: '部门编号', align: 'center', value: 'deptId' },
        { text: '部门名称', align: 'center', value: 'deptName' },
        { text: '排序', align: 'center', value: 'orderNum' },
        { text: '负责人', align: 'center', value: 'leader' },
        { text: '联系电话', align: 'center', value: 'phone' },
        { text: '邮箱', align: 'center', value: 'email' },
        { text: '状态', align: 'center', value: 'status' },
        { text: '创建时间', align: 'center', value: 'createTime' },
        { text: '操作', align: 'center', value: 'handle' }
      ],
      deptList: [],
      open: false
    }
  },
  created() {
    this.getDeptList()
  },
  mounted() {
    console.log(this.$refs.treeTb)
  },
  methods: {
    /**
       * 部门树数据
       */
    getDeptList() {
      deptList().then(res => {
        this.deptList = res.data.data
      })
    },
    openOrClose() {
      this.open = !this.open
      this.$refs.treeTb.updateAll(this.open)
    },
    /**
     * 添加
     */
    addDept(item) {
      const dept = JSON.parse(JSON.stringify(item))
      this.dept = {
        status: '0'
      }
      this.dept.parentId = dept.deptId
      this.$refs.dept.resetValidation()
      this.editFlag = true
    },
    /**
     * 修改
     */
    editDept(item) {
      const dept = JSON.parse(JSON.stringify(item))
      this.dept = dept
      this.editFlag = true
    },
    addOrEditSubmit() {
      if (this.$refs.dept.validate()) {
        deptAddOrEdit(this.dept).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.editFlag = false
            this.getDeptList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    delDept(item) {
      this.$confirm.fire({
        title: '操作确认?',
        text: '确认删除' + item.deptName + '吗?删除后，您将无法恢复！',
        icon: 'warning'
      }).then((result) => {
        if (result.value) {
          delDept(item).then(res => {
            if (res.data.code === 200) {
              this.$confirm.fire(
                '删除成功!',
                '您要删除的已删除.',
                'success'
              )
              this.getDeptList()
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

<style scoped>

</style>
