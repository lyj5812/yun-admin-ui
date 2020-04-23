<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="3" xs="12">
        <v-card class="br-6 box-shadow py-4">
          <v-card-title class="b-left">部门列表</v-card-title>
          <v-card-text>
            <dept-tree
              :open-flag="true"
              tree="tree"
              @clickNode="selectdItem"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="9" xs="12">
        <v-card class="br-6 box-shadow pt-5">
          <v-card-title class="b-left">用户列表</v-card-title>
          <v-card-text>
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
                    <v-btn
                      x-small
                      fab
                      color="success"
                      @click="getUserListPageData"
                    >
                      <v-icon dark>mdi-sync</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:user:add']"
                      class="ml-2"
                      x-small
                      fab
                      color="primary"
                      @click="addOrEdit({})"
                    >
                      <v-icon dark>add</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:user:export']"
                      x-small
                      fab
                      color="info"
                      class="ml-2"
                      :disabled="selected.length<1"
                      @click="exportExcel()"
                    >
                      <v-icon dark>mdi-export-variant</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:user:edit']"
                      x-small
                      fab
                      color="warning"
                      class="ml-2"
                      :disabled="selected.length!=1"
                      @click="addOrEdit(selected[0])"
                    >
                      <v-icon dark>edit</v-icon>
                    </v-btn>
                    <v-btn
                      v-perms="['system:user:del']"
                      x-small
                      fab
                      color="error"
                      class="ml-2"
                      :disabled="selected.length<1"
                      @click="delUsers(selected)"
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
                          v-model="page.username"
                          label="登录名称"
                          outlined
                          dense
                          hide-details
                          clearable
                        />
                      </v-col>
                      <v-col cols="12" xs="12" sm="12" lg="2">
                        <v-text-field
                          v-model="page.phonenumber"
                          label="手机号码"
                          outlined
                          dense
                          hide-details
                          clearable
                        />
                      </v-col>
                      <v-col cols="12" xs="12" sm="12" lg="2">
                        <dict v-model="page.status" dense outlined dict-type="sys_user_status" />
                      </v-col>
                      <v-col cols="12" xs="12" sm="12" lg="1" offset-xs="9">
                        <v-btn v-perms="['system:user:search']" color="primary" dark @click="getUserListPageData()">
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
                {{ item.status==0?'正常':'停用' }}
              </template>
              <template v-slot:item.handle="{ item }">
                <v-btn v-perms="['system:user:edit']" fab x-small class="ma-1" color="success" @click="addOrEdit(item)">
                  <v-icon dark>add</v-icon>
                </v-btn>
                <v-btn v-perms="['system:user:del']" fab x-small class="ma-1" color="error" @click="delUsers([item])">
                  <v-icon dark>delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
            <pagination
              :page-sizes="[10,20]"
              :page-data="userPageData"
              @pageChange="getUserListPage"
            />
          </v-card-text>
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
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-row no-gutters>
                  <v-col cols="12" lg="5" xs="6">
                    <v-text-field
                      v-model="user.realName"
                      class="small"
                      outlined
                      dense
                      clearable
                      :rules="[v => !!v || '请输入用户名!']"
                      label="用户名称"
                    >
                      <template v-slot:prepend>
                        <small class="red--text my-2">*</small>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="5" xs="6" offset-lg="2">
                    <v-text-field
                      v-model="dept.deptName"
                      class="small"
                      outlined
                      dense
                      clearable
                      :value="user.deptId"
                      append-icon="search"
                      :rules="[v => !!v || '请输入部门!']"
                      label="归属部门"
                      @focus="selectDept()"
                    >
                      <template v-slot:prepend>
                        <small class="red--text my-2">*</small>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="5" xs="6">
                    <v-text-field
                      v-model="user.phonenumber"
                      class="small"
                      outlined
                      dense
                      clearable
                      :rules="[v => !!v || '请输入号码!',v => /^1[3456789]\d{9}$/.test(v) || '请输入正确的手机号']"
                      label="手机号码"
                    >
                      <template v-slot:prepend>
                        <small class="red--text my-2">*</small>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="5" xs="6" offset-lg="2">
                    <v-text-field
                      v-model="user.email"
                      class="small"
                      outlined
                      dense
                      clearable
                      :rules="[v => !!v || '请输入邮箱!',v => /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(v) || '请输入正确的邮箱']"
                      label="邮箱"
                    >
                      <template v-slot:prepend>
                        <small class="red--text my-2">*</small>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="5" xs="6">
                    <v-text-field
                      v-model="user.username"
                      class="small"
                      outlined
                      dense
                      clearable
                      :disabled="user.userId?true:false"
                      :rules="[checkFlag]"
                      label="登录名称"
                      @input="checkUsername()"
                    >
                      <template v-slot:prepend>
                        <small class="red--text my-2">*</small>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col v-if="!user.userId" cols="12" lg="5" xs="6" offset-lg="2">
                    <v-text-field
                      v-model="user.password"
                      class="small"
                      outlined
                      dense
                      clearable
                      type="password"
                      :rules="[v => !!v || '请输入登录密码!']"
                      label="登录密码"
                    >
                      <template v-slot:prepend>
                        <small class="red--text my-2">*</small>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col v-else cols="12" lg="5" xs="6" />
                  <v-col cols="12" lg="5" xs="6" class="pl-3">
                    <dict
                      v-model="user.sex"
                      outlined
                      dense
                      dict-type="sys_user_sex"
                    />
                  </v-col>
                  <v-col cols="12" lg="5" xs="6" offset-lg="2">
                    <v-switch
                      v-model="user.status"
                      class="mt-2 ml-4"
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
                      class="ml-4"
                      :items="posts"
                      outlined
                      dense
                      clearable
                      item-text="postName"
                      item-value="postId"
                      label="岗位"
                      no-data-text="没有选项"
                      multiple
                      chips
                      :menu-props="{ offsetY: true }"
                    />
                  </v-col>
                  <v-col cols="12" lg="12" xs="12" class="ml-4">
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
                      class="ml-4"
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
  </v-container>
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
      filterFlag: false,
      valid: true,
      selected: [],
      user: {},
      dept: {},
      posts: [],
      roles: [],
      page: {
        current: 1,
        size: 10,
        username: null,
        deptId: null,
        phonenumber: null,
        status: null
      },
      th: [
        { text: '用户编号', align: 'center', sortable: true, value: 'userId' },
        { text: '登录名称', align: 'center', sortable: false, value: 'username' },
        { text: '用户名称', align: 'center', sortable: false, value: 'realName' },
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
    checkUsername() {
      this.checkFlag = true
      if (!this.user.username) {
        this.checkFlag = false || '登录名不能为空'
      } else if (this.user.username && !this.user.userId) {
        checkUsername(this.user.username).then(res => {
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
      this.checkUsername()
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
            this.$message.success('成功')
            this.addOrEditFlag = false
            this.getUserListPageData()
          } else {
            this.$message.error('失败')
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
      this.$confirm.fire({
        title: '操作确认?',
        text: '删除后，您将无法恢复!',
        icon: 'warning'
      }).then((result) => {
        if (result.value) {
          deleteList(users).then(res => {
            if (res.data.code === 200) {
              this.$confirm.fire(
                '删除成功!',
                '您要删除的已删除.',
                'success'
              )
              this.getUserListPageData(this.rolePage)
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
