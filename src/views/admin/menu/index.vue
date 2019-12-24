<template>
  <div>
    <v-card class="br-6 mx-4 mt-3 box-shadow pt-3">
      <v-row class="mb-n5">
        <v-col cols="12" xs="12" lg="9">
          <v-card-title class="b-left mb-3">菜单列表</v-card-title>
        </v-col>
        <v-col cols="12" xs="12" lg="2">
          <v-text-field
            v-model="search"
            label="搜索"
            class="small ml-5"
            outlined
            clearable
            hide-details
            prepend-inner-icon="search"
          />
        </v-col>
        <v-col cols="12" xs="12" lg="1">
          <v-btn
            v-perms="['system:menu:add']"
            small
            color="primary"
            class="mt-3"
            dark
            @click="addMenu({})"
          >
            <v-icon small dark>fa fa-plus</v-icon>
            添加
          </v-btn>
        </v-col>
      </v-row>
      <v-card-text>
        <tree-table
          :search="search"
          :headers="headers"
          :items="menuList"
          item-key="menuId"
        >
          <template v-slot:item.icon="{item}">
            <v-icon v-if="item.menuType==0">{{ item.icon }}</v-icon>
            <v-btn
              v-if="item.menuType==1"
              x-small
              color="purple"
              dark
            >按钮
            </v-btn>
          </template>
          <template v-slot:item.hidden="{ item }">
            <v-chip
              v-if="item.hidden==0"
              small
              color="green"
              label
              dark
            >
              显示
            </v-chip>
            <v-chip
              v-else
              small
              color="red"
              dark
              label
            >
              隐藏
            </v-chip>
          </template>
          <template v-slot:item.handle="{ item }">
            <v-btn v-perms="['system:menu:edit']" fab x-small color="success" class="mt-1 mb-1" @click="editMenu(item)">
              <v-icon dark>fa fa-pencil</v-icon>
            </v-btn>
            <v-btn v-perms="['system:menu:del']" fab x-small class="mt-1 mb-1" color="error" @click="delMenus(item)">
              <v-icon dark>fa fa-trash-o</v-icon>
            </v-btn>
            <v-btn v-perms="['system:menu:add']" fab x-small class="mt-1 mb-1" color="primary" @click="addMenu(item)">
              <v-icon dark>fa fa-plus</v-icon>
            </v-btn>
          </template>
        </tree-table>
      </v-card-text>
    </v-card>
    <!--菜单添加修改-->
    <v-form ref="menu" :model="menu">
      <v-dialog v-model="editFlag" scrollable persistent max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ menu.menuId?'修改菜单':'添加菜单' }}</span>
            <v-spacer />
            <v-btn class="mx-0" icon @click.stop="editFlag = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row class="pa-5" no-gutters>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-text-field
                  v-model="menu.parentId"
                  disabled
                  label="父节点ID"
                  class="small"
                  outlined
                >
                  <template v-slot:prepend>
                    <small class="red-text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-text-field
                  v-model="menu.menuId"
                  disabled
                  label="节点ID"
                  class="small ml-5"
                  outlined
                >
                  <template v-slot:prepend>
                    <small class="red-text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-text-field
                  v-model="menu.name"
                  label="节点名称："
                  :rules="[v => !!v || '请输入名称!']"
                  class="small"
                  outlined
                  clearable
                >
                  <template v-slot:prepend>
                    <small class="red-text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-text-field
                  v-model="menu.orderNum"
                  label="排序号"
                  type="number"
                  class="small ml-5"
                  outlined
                  clearable
                >
                  <template v-slot:prepend>
                    <small class="red-text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-radio-group
                  v-model="menu.menuType"
                  label="节点类型："
                  class="mt-2 ml-5"
                  :rules="[v => !!v || '请选择类型!']"
                  row
                >
                  <v-radio
                    label="菜单"
                    color="indigo"
                    value="0"
                  />
                  <v-radio
                    label="按钮"
                    color="purple"
                    value="1"
                  />
                </v-radio-group>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                xs="6"
              >
                <v-radio-group
                  v-model="menu.hidden"
                  label="是否隐藏："
                  class="mt-2 ml-5"
                  row
                >
                  <v-radio
                    label="显示"
                    color="indigo"
                    :value="false"
                  />
                  <v-radio
                    label="隐藏"
                    color="purple"
                    :value="true"
                  />
                </v-radio-group>
              </v-col>

              <v-col
                v-if="menu.menuType==0"
                cols="12"
                lg="12"
                xs="12"
              >
                <icon-field v-model="menu.icon" required />
              </v-col>

              <v-col
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-if="menu.menuType==1"
                  v-model="menu.perms"
                  class="small"
                  label="权限标识"
                  :rules="[v => !!v || '请输入标识!']"
                  outlined
                  clearable
                >
                  <template v-slot:prepend>
                    <small class="red-text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                v-if="menu.menuType==0"
                cols="12"
                lg="12"
                xs="12"
                class="mt-5"
              >
                <v-text-field
                  v-model="menu.component"
                  label="页面路径"
                  class="small ml-4"
                  hide-details
                  outlined
                  clearable
                />
                <v-subheader>
                  <v-icon small color="warning">
                    warning
                  </v-icon>
                  vue文件在项目中相对views的路径,目录可不填
                </v-subheader>
              </v-col>
              <v-col
                v-if="menu.menuType==0"
                cols="12"
                lg="12"
                xs="12"
              >
                <v-text-field
                  v-model="menu.path"
                  label="页面url"
                  class="small"
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入url!']"
                >
                  <template v-slot:prepend>
                    <small class="red-text my-4">*</small>
                  </template>
                </v-text-field>
                <v-subheader class="mt-n6">
                  <v-icon small color="warning">
                    warning
                  </v-icon>
                  菜单在地址栏显示的路径，推荐父菜单路径+子路径
                </v-subheader>
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
  </div>
</template>

<script>
import { menuAddOrEdit, getMenuById, menuList, delMenu } from '@/api/system/menu'
import TreeTable from '@/components/TreeTable'
import IconField from '@/components/IconField'
export default {
  name: 'Menu',
  components: {
    IconField,
    TreeTable
  },
  data() {
    return {
      menu: {},
      menuList: [],
      search: null,
      editFlag: false,
      parentMenu: {},
      headers: [
        { text: '菜单名称', align: 'center', value: 'name' },
        { text: '图标', align: 'center', value: 'icon' },
        { text: '排序', align: 'center', value: 'orderNum' },
        { text: '权限标识', align: 'center', value: 'perms' },
        { text: '页面路径', align: 'center', value: 'component' },
        { text: '页面Url', align: 'center', value: 'path' },
        { text: '是否显示', align: 'center', value: 'hidden' },
        { text: '创建时间', align: 'center', value: 'createTime' },
        { text: '操作', align: 'center', value: 'handle' }
      ],
      selectedTab: null
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    loadParentMenu(menu) {
      if (menu.parentId) {
        getMenuById().then(res => {
          this.menuList = res.data.data
        })
      }
    },
    /**
     * 菜单树数据
     */
    getMenuList() {
      menuList().then(res => {
        this.menuList = res.data.data
      })
    },
    /**
     * 修改
     */
    editMenu(item) {
      const menu = JSON.parse(JSON.stringify(item))
      this.editFlag = true
      this.menu = menu
    },
    /**
     * 添加
     */
    addMenu(item) {
      const menu = JSON.parse(JSON.stringify(item))
      this.editFlag = true
      this.menu = {
        parentId: menu.menuId,
        menuType: '0',
        hidden: false
      }
      this.$refs.menu.resetValidation()
    },
    delMenus(menu) {
      swal({
        title: '操作确认',
        text: '确认删除' + menu.name + '以及子节点吗?删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          delMenu(menu).then(res => {
            if (res.data.code === 200) {
              this.getMenuList()
              this.$message.success(res.data.msg)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    addOrEditSubmit() {
      if (this.$refs.menu.validate()) {
        menuAddOrEdit(this.menu).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.editFlag = false
            this.getMenuList()
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
