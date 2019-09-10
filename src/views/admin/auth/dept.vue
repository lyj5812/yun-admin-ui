<template>
  <v-row>
    <v-col cols="12" xl="4" lg="4" xs="12" sm="12">
      <v-card class="pa-2 elevation-4">
        <v-btn
          v-perms="['system:dept:add']"
          small
          rounded
          color="primary"
          dark
          @click="addOrEdit(0)"
        >
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn
          v-perms="['system:dept:edit']"
          small
          rounded
          class="ml-2"
          color="warning"
          :disabled="dept.deptId==null"
          @click="addOrEdit(1)"
        >
          <v-icon dark>edit</v-icon>
        </v-btn>
        <v-btn
          v-perms="['system:dept:del']"
          small
          rounded
          class="ml-2"
          color="error"
          :disabled="dept.deptId==null"
          @click="delDept()"
        >
          <v-icon dark>delete</v-icon>
        </v-btn>
      </v-card>
      <v-card class="mt-2 elevation-4">
        <v-scroll>
          <div style="height: 600px" class="px-4 mr-1">
            <dept-tree ref="deptTree" :open-flag="true" class="mt-3" @clickNode="selectdItem" />
          </div>
        </v-scroll>
      </v-card>
    </v-col>
    <v-col col="12" xl="8" lg="8" xs="12" sm="12">
      <v-card class="pa-4 elevation-4">
        <v-form ref="dept" :model="dept">
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
                class="small"
                outlined
              />
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
                class="small"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              lg="12"
              xs="12"
            >
              <v-text-field
                v-model="dept.deptName"
                :disabled="disabledFlag"
                :rules="[v => !!v || '请输入名称!']"
                label="部门名称"
                class="small"
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
                v-model="dept.leader"
                :disabled="disabledFlag"
                label="负责人"
                class="small"
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
                :disabled="disabledFlag"
                label="联系电话"
                class="small"
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
                :disabled="disabledFlag"
                label="邮箱"
                class="small"
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
                :disabled="disabledFlag"
                label="排序号"
                type="number"
                class="small"
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
                class="mt-1 ml-5"
                :disabled="disabledFlag"
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
            <v-col
              cols="12"
              lg="6"
              xs="6"
              offset-xs="6"
              offset-lg="6"
            >
              <v-btn
                v-show="!disabledFlag"
                small
                color="success"
                @click="addOrEditSubmit()"
              >
                <v-icon dark>done</v-icon>
                提交
              </v-btn>
              <v-btn
                v-show="!disabledFlag"
                small
                color="secondary"
                @click="addOrEditCancel()"
              >
                <v-icon dark>close</v-icon>
                取消
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { deptAddOrEdit, delDept } from '@/api/system/dept'
import DeptTree from '@/views/components/dept/deptTree'
export default {
  components: {
    DeptTree
  },
  data() {
    return {
      disabledFlag: true,
      dept: {}
    }
  },
  methods: {
    /**
       * 添加或修改flag 0 添加,1 修改
       */
    addOrEdit(flag) {
      if (flag === 0) {
        if (this.dept.deptId == null) {
          this.dept.parentId = 0
        } else {
          this.dept = {
            parentId: this.dept.deptId
          }
        }
        this.disabledFlag = false
      } else if (flag === 1) {
        this.disabledFlag = false
      }
    },
    addOrEditSubmit() {
      if (this.$refs.dept.validate()) {
        deptAddOrEdit(this.dept).then(res => {
          if (res.data.code === 200) {
            this.message.success(res.data.msg)
            this.disabledFlag = true
            this.$refs.deptTree.getDeptList()
          } else {
            this.message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    addOrEditCancel() {
      this.disabledFlag = true
    },
    selectdItem(item) {
      // 直接等于是引用,menu改变,item会跟着改变...
      this.dept = JSON.parse(JSON.stringify(item))
    },
    delDept() {
      // eslint-disable-next-line no-undef
      swal({
        title: '操作确认',
        text: '确认删除吗?删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          delDept(this.dept).then(res => {
            if (res.data.code === 200) {
              this.message.success(res.data.msg)
              this.disabledFlag = true
              this.$refs.deptTree.getDeptList()
              this.dept = {}
            } else {
              this.message.error(res.data.msg)
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
