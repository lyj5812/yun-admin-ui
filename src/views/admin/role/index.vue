<template>
  <v-container>
    <v-card class="br-6 box-shadow mt-3 pt-5">
      <v-card-title class="b-left">角色管理</v-card-title>
      <v-card-text>
        <v-data-table
          v-model="selected"
          :headers="th"
          :items="rolePage.records"
          hide-default-footer
          show-select
          item-key="roleId"
          :mobile-breakpoint="1000"
          :loading="dataFlag"
          loading-text="加载中... 请稍后！"
        >
          <template v-if="rolePage.records&&rolePage.records.length===0" #body>
            <td :colspan="th.length+1">
              <v-row justify="center">
                <v-img max-height="200" class="ma-4" max-width="200" :src="require('@/assets/images/table/no-data.svg')" />
              </v-row>
            </td>
          </template>
          <template v-slot:top>
            <v-row>
              <v-col cols="12" xs="12" sm="12" lg="5">
                <v-btn rounded small color="success" @click="getRoleListPageData">
                  <v-icon dark>mdi-sync</v-icon>
                </v-btn>
                <v-btn v-perms="['system:role:add']" rounded small class="ml-2" color="primary" @click="addOrEdit({})">
                  <v-icon>add</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:role:export']"
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
                  v-perms="['system:role:edit']"
                  rounded
                  small
                  class="ml-2"
                  color="warning"
                  :disabled="selected.length!=1"
                  @click="addOrEdit(selected[0])"
                >
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:role:del']"
                  rounded
                  small
                  class="ml-2"
                  color="error"
                  :disabled="selected.length<1"
                  @click="delRoles(selected)"
                >
                  <v-icon dark>delete</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" xs="12" sm="12" lg="2">
                <v-text-field
                  v-model="page.roleName"
                  label="角色名称"
                  hide-details
                  class="small mt-n3"
                  outlined
                  clearable
                />
              </v-col>
              <v-col cols="12" xs="12" sm="12" lg="2">
                <v-text-field
                  v-model="page.roleKey"
                  label="权限字符"
                  hide-details
                  class="small mt-n3"
                  outlined
                  clearable
                />
              </v-col>

              <v-col cols="12" xs="12" sm="12" lg="2">
                <dict v-model="page.status" dict-type="role_status" class="mt-n3" />
              </v-col>

              <v-col cols="12" xs="12" sm="12" lg="1" offset-xs="9">
                <v-btn v-perms="['system:role:search']" small color="primary" dark @click="getRoleListPageData()">
                  <v-icon dark>search</v-icon>
                  搜索
                </v-btn>
              </v-col>
            </v-row>
            <v-divider />
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
          <template #item.handle="{ item }">
            <v-btn v-perms="['system:role:edit']" fab x-small color="success" @click="addOrEdit(item)">
              <v-icon dark>fa fa-pencil</v-icon>
            </v-btn>
            <v-btn v-perms="['system:role:del']" fab x-small color="error" @click="delRoles([item])">
              <v-icon dark>fa fa-trash-o</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <pagination
          :page-sizes="[10,20]"
          :page-data="rolePage"
          @pageChange="getRoleListPage"
        />
      </v-card-text>
    </v-card>
    <!--添加修改-->
    <v-form ref="role" :model="role">
      <v-dialog v-model="editFlag" scrollable max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ role.roleId?'修改角色':'添加角色' }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-row no-gutters>
                <v-col cols="12" xs="12">
                  <v-text-field
                    v-model="role.roleName"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入名称!']"
                    label="角色名称"
                  >
                    <template #prepend>
                      <small class="red-text my-4">*</small>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" xs="12">
                  <v-text-field
                    v-model="role.roleKey"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入字符!']"
                    label="权限字符"
                  >
                    <template #prepend>
                      <small class="red-text my-4">*</small>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6">
                  <v-text-field
                    v-model="role.roleSort"
                    class="small"
                    outlined
                    clearable
                    :rules="[v => !!v || '请输入顺序!']"
                    label="显示顺序"
                    type="number"
                  >
                    <template #prepend>
                      <small class="red-text my-4">*</small>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" xs="12" offset-sm="1" sm="5">
                  <v-switch
                    v-model="role.status"
                    label="状态正常"
                    color="primary"
                    inset
                    value="0"
                    false-value="1"
                    true-value="0"
                    hide-details
                    class="mt-2 mb-6"
                  />
                </v-col>
                <v-col cols="12" xs="12">
                  <v-text-field
                    v-model="role.remark"
                    class="small ml-4"
                    outlined
                    clearable
                    label="备注"
                  />
                </v-col>
                <v-col cols="12" xs="12">
                  <menu-tree ref="menuTree" v-model="role.menuIds" class="ml-4" :selectable="true" />
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
import MenuTree from '@/views/components/menu/menuTree'
import { roleListPage, addOrEdit, delList, menuIdsByRoleId } from '@/api/system/role'
export default {
  components: {
    MenuTree
  },
  data() {
    return {
      rolePage: {},
      selected: [],
      selectedTemp: [],
      editFlag: false,
      dataFlag: true,
      tree: null,
      role: {
        menuIds: []
      },
      th: [
        { text: '角色编号', align: 'center', sortable: true, value: 'roleId' },
        { text: '角色名称', align: 'center', sortable: false, value: 'roleName' },
        { text: '权限字符', align: 'center', sortable: false, value: 'roleKey' },
        { text: '排序', align: 'center', sortable: true, value: 'roleSort' },
        { text: '状态', align: 'center', sortable: false, value: 'status' },
        { text: '创建时间', align: 'center', sortable: true, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      page: {
        current: 1,
        size: 10,
        roleName: null,
        roleKey: null,
        status: null
      }
    }
  },
  mounted() {
    this.getRoleListPage(this.page)
  },
  methods: {
    /**
       * 角色分页数据
       */
    getRoleListPage(page) {
      this.page.current = page.current
      this.page.size = page.size
      this.getRoleListPageData()
    },
    getRoleListPageData() {
      this.dataFlag = true
      roleListPage(this.page).then(res => {
        this.rolePage = res.data.data
        this.dataFlag = false
      })
    },
    /**
       * 打开模态框
       */
    addOrEdit(item) {
      this.editFlag = true
      this.role = item
      if (item.roleId) {
        menuIdsByRoleId(item.roleId).then(res => {
          this.$refs.menuTree.setMenuIds(res.data.data)
        })
      } else {
        this.$refs.role.reset()
        if (this.$refs.menuTree) {
          this.$refs.menuTree.tree = []
        }
        this.role.status = '0'
        this.editFlag = true
      }
    },
    /**
       * 添加或者修改提交
       * @returns {boolean}
       */
    addOrEditSubmit() {
      if (this.$refs.role.validate()) {
        this.role.menuIds = this.$refs.menuTree.getMenuIds()
        addOrEdit(this.role).then(res => {
          if (res.data.code === 200) {
            this.$message.success('成功')
            this.editFlag = false
            this.getRoleListPage(this.rolePage)
          } else {
            this.$message.error('失败')
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    /**
       * 删除角色
       * @param roles
       */
    delRoles(roles) {
      // eslint-disable-next-line no-undef
      swal({
        title: '操作确认',
        text: '删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          const ids = roles.map((n) => { return n.roleId })
          delList(ids).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.getRoleListPage(this.rolePage)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    /**
     * 导出excel
     */
    exportExcel() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['角色编号', '角色名称', '权限字符', '排序', '状态', '创建时间']
        const filterVal = ['roleId', 'roleName', 'roleKey', 'roleSort', 'status', 'createTime']
        const list = this.selected
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '角色信息',
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
