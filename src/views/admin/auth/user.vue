<template>
  <v-row>
    <v-col cols="12" lg="3" xs="12">
      <v-card class="pa-2 elevation-4">
        <dept-tree
          :open-flag="true"
          tree="tree"
          @clickNode="selectdItem"
        />
      </v-card>
    </v-col>
    <v-col cols="12" lg="9" xs="12">
      <v-card class="elevation-4">
        <v-row class="pa-5 ml-3">
          <v-col cols="12" xs="12" lg="2">
            <v-text-field
              v-model="page.loginName"
              class="small"
              label="登录名称"
              outlined
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" xs="12" lg="2" offset-lg="1">
            <v-text-field
              v-model="page.phonenumber"
              class="small"
              label="手机号码"
              outlined
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" xs="12" lg="2" offset-lg="1">
            <dict v-model="page.status" dict-type="role_status" />
          </v-col>
          <v-col cols="12" xs="12" lg="2" offset-lg="1" offset-xs="9">
            <v-btn v-perms="['system:user:search']" small color="primary" class="mt-1" dark @click="getUserListPageData()">
              <v-icon dark>search</v-icon>
              搜索
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="mt-2 elevation-4">
        <v-data-table
          v-model="selected"
          :headers="th"
          :items="userPageData.records"
          hide-default-footer
          show-select
          item-key="userId"
          :loading="dataFlag"
          loading-text="加载中... 请稍后！"
        >
          <template v-if="userPageData.records&&userPageData.records.length===0" v-slot:body>
            <td :colspan="th.length+1">
              <v-row justify="center">
                <v-img max-height="200" class="ma-4" max-width="200" :src="require('@/assets/images/table/no-data.svg')" />
              </v-row>
            </td>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn rounded small color="success" @click="getUserListPageData">
                <v-icon dark>mdi-sync</v-icon>
              </v-btn>
              <v-btn v-perms="['system:user:add']" class="ml-2" rounded small color="primary" @click="addOrEdit({})">
                <v-icon dark>add</v-icon>
              </v-btn>
              <v-btn
                v-perms="['system:user:export']"
                rounded
                small
                color="info"
                class="ml-2"
                :disabled="selected.length<1"
                @click="exportExcel()"
              >
                <v-icon dark>mdi-export-variant</v-icon>
              </v-btn>
              <v-btn
                v-perms="['system:user:edit']"
                rounded
                small
                color="warning"
                class="ml-2"
                :disabled="selected.length!=1"
                @click="addOrEdit(selected[0])"
              >
                <v-icon dark>edit</v-icon>
              </v-btn>
              <v-btn
                v-perms="['system:user:del']"
                rounded
                small
                color="error"
                class="ml-2"
                :disabled="selected.length<1"
                @click="delUsers(selected)"
              >
                <v-icon dark>delete</v-icon>
              </v-btn>

            </v-toolbar>
            <v-divider />
          </template>
          <template v-slot:item.status="{ item }">
            {{ item.status==0?'正常':'停用' }}
          </template>
          <template v-slot:item.handle="{ item }">
            <v-btn v-perms="['system:user:edit']" fab x-small color="warning" @click="addOrEdit(item)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn v-perms="['system:user:del']" fab x-small color="error" @click="delUsers([item])">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <pagination
          :page-sizes="[10,20]"
          :page-data="userPageData"
          @pageChange="getUserListPage"
        />
      </v-card>
    </v-col>

    <!--添加修改-->
    <v-form ref="user" v-model="valid" :model="user">
      <v-dialog v-model="addOrEditFlag" scrollable persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="title font-weight-bold">{{ user.userId?'修改用户':'添加用户' }}</span>
            <v-spacer />
            <v-btn class="mx-0" icon @click.stop="addOrEditFlag = false">
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-row no-gutters>
                <v-col cols="12" lg="5" xs="6">
                  <v-text-field
                    v-model="user.userName"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入用户名!']"
                    label="用户名称"
                  />
                </v-col>
                <v-col cols="12" lg="5" xs="6" offset-lg="2">
                  <v-text-field
                    v-model="dept.deptName"
                    class="small"
                    outlined
                    clearable
                    :value="user.deptId"
                    append-icon="search"
                    :rules="[v => !!v || '请输入部门!']"
                    label="归属部门"
                    @focus="selectDept()"
                  />
                </v-col>
                <v-col cols="12" lg="5" xs="6">
                  <v-text-field
                    v-model="user.phonenumber"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入号码!',v => /^1[3456789]\d{9}$/.test(v) || '请输入正确的手机号']"
                    label="手机号码"
                  />
                </v-col>
                <v-col cols="12" lg="5" xs="6" offset-lg="2">
                  <v-text-field
                    v-model="user.email"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入邮箱!',v => /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(v) || '请输入正确的邮箱']"
                    label="邮箱"
                  />
                </v-col>
                <v-col cols="12" lg="5" xs="6">
                  <v-text-field
                    v-model="user.loginName"
                    class="small"
                    outlined
                    clearable
                    :disabled="user.userId?true:false"
                    :rules="[checkFlag]"
                    label="登录名称"
                    @input="checkLoginName()"
                  />
                </v-col>
                <v-col v-if="user.userId==null" cols="12" lg="5" xs="6" offset-lg="2">
                  <v-text-field
                    v-model="user.password"
                    class="small"
                    outlined
                    clearable
                    type="password"
                    :rules="[v => !!v || '请输入登录密码!']"
                    label="登录密码"
                  />
                </v-col>
                <v-col v-else cols="12" lg="5" xs="6" />
                <v-col cols="12" lg="5" xs="6">
                  <dict v-model="user.sex" dict-type="sys_user_sex" />
                </v-col>
                <v-col cols="12" lg="5" xs="6" offset-lg="2">
                  <v-switch
                    v-model="user.status"
                    class="mt-1 ml-4"
                    label="状态正常"
                    color="primary"
                    inset
                    :rules="[v => !!v || '请输入状态!']"
                    false-value="1"
                    true-value="0"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" xs="12" class="mt-4">
                  <v-select
                    v-model="user.postIds"
                    :items="posts"
                    outlined
                    clearable
                    item-text="postName"
                    item-value="postId"
                    label="岗位"
                    no-data-text="没有选项"
                    multiple
                    chips
                  />
                </v-col>
                <v-col cols="12" lg="12" xs="12">
                  角色
                  <v-row no-gutters>
                    <v-col v-for="role in roles" :key="role.roleId" cols="12" lg="3">
                      <v-checkbox
                        v-model="user.roleIds"
                        multiple
                        color="primary"
                        :label="role.roleName"
                        :value="role.roleId"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="12" xs="12">
                  <v-textarea
                    v-model="user.remark"
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
            <v-btn small color="success" @click="addOrEditSubmit()">
              <v-icon dark>done</v-icon>
              提交
            </v-btn>
            <v-btn small color="secondary" class="ml-2" @click="addOrEditFlag=false">
              <v-icon dark>close</v-icon>
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
    <v-dialog v-model="selDeptFlag" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span>选择部门</span>
        </v-card-title>
        <v-card-text>
          <dept-tree ref="deptTree" :open-flag="true" @clickNode="selectdDept" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {
  userListPage,
  userAddOrEdit,
  getRoleIdsAndPostIdsAndDeptByUserId,
  deleteList,
  checkUsername
} from '@/api/system/user'
import { postList } from '@/api/system/post'
import { roleList } from '@/api/system/role'
import DeptTree from '@/views/components/dept/deptTree'

export default {
  components: {
    DeptTree
  },
  data() {
    return {
      dataFlag: true,
      delFlag: false,
      addOrEditFlag: false,
      selDeptFlag: false,
      valid: true,
      selected: [],
      user: {},
      dept: {},
      posts: [],
      roles: [],
      page: {
        current: 1,
        size: 10,
        loginName: null,
        deptId: null,
        phonenumber: null,
        status: null
      },
      th: [
        { text: '用户编号', align: 'center', sortable: true, value: 'userId' },
        { text: '登录名称', align: 'center', sortable: false, value: 'loginName' },
        { text: '用户名称', align: 'center', sortable: false, value: 'userName' },
        { text: '手机', align: 'center', sortable: false, value: 'phonenumber' },
        { text: '用户状态', align: 'center', sortable: false, value: 'status' },
        { text: '创建时间', align: 'center', sortable: true, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      userPageData: {},
      checkFlag: true
    }
  },
  created() {
    this.getUserListPageData()
  },
  methods: {
    /* 校验用户名 */
    checkLoginName() {
      this.checkFlag = true
      if (!this.user.loginName) {
        this.checkFlag = false || '登录名不能为空'
      } else if (this.user.loginName && !this.user.userId) {
        checkUsername(this.user.loginName).then(res => {
          if (res.data.data) {
            this.checkFlag = false || '登录名已存在'
          } else {
            this.checkFlag = true
          }
        })
      }
      return this.checkFlag
    },
    /**
    * 添加或修改
    */
    addOrEdit(item) {
      this.getPostList()
      this.getRoleList()
      this.user = item
      this.checkLoginName()
      if (this.user.userId != null) {
        getRoleIdsAndPostIdsAndDeptByUserId(this.user.userId).then(res => {
          this.user.roleIds = res.data.data.roleIds
          this.user.postIds = res.data.data.postIds
          this.dept = res.data.data.dept
        })
      } else {
        this.$refs.user.resetValidation()
        this.user.password = '123456'
        this.user.deptId = this.dept.deptId
        this.user.status = '0'
      }
      this.addOrEditFlag = true
    },
    addOrEditSubmit() {
      if (this.$refs.user.validate()) {
        userAddOrEdit(this.user).then(res => {
          if (res.data.code === 200) {
            this.message.success('成功')
            this.addOrEditFlag = false
            this.getUserListPageData()
          } else {
            this.message.error('失败')
          }
        })
      } else {
        return false
      }
    },
    selectdItem(item) {
      // 直接等于是引用,dept改变,item会跟着改变...
      this.dept = JSON.parse(JSON.stringify(item))
      this.page.deptId = this.dept.deptId
      this.getUserListPageData()
    },
    /**
     * 用户分页数据
     */
    getUserListPage(page) {
      this.page.current = page.current
      this.page.size = page.size
      this.getUserListPageData()
    },
    getUserListPageData() {
      this.dataFlag = true
      this.selected = []
      userListPage(this.page).then(res => {
        this.userPageData = res.data.data
        this.dataFlag = false
      })
    },
    /**
     * 岗位list
     */
    getPostList() {
      postList().then(res => {
        this.posts = res.data.data
      })
    },

    /**
     * 角色list
     */
    getRoleList() {
      roleList().then(res => {
        this.roles = res.data.data
      })
    },
    selectDept() {
      setTimeout(() => {
        this.selDeptFlag = true
      }, 200)
    },
    selectdDept(dept) {
      this.dept = dept
      this.user.deptId = dept.deptId
      this.selDeptFlag = false
    },
    delUsers(users) {
      // eslint-disable-next-line no-undef
      swal({
        title: '操作确认',
        text: '删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((willDelete) => {
        if (willDelete) {
          deleteList(users).then(res => {
            if (res.data.code === 200) {
              this.message.success(res.data.msg)
              this.getUserListPageData()
            } else {
              this.message.error(res.data.msg)
            }
          })
        }
      })
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户编号', '登录名称', '用户名称', '手机', '用户状态', '创建时间']
        const filterVal = ['userId', 'loginName', 'userName', 'phonenumber', 'status', 'createTime']
        const list = this.selected
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户信息',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'status') {
          return v[j] === '0' ? '正常' : '停用'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
