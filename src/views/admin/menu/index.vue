<template>
  <v-row>
    <v-col cols="12" xl="4" lg="4" xs="12" sm="12">
      <v-card class="pa-2 elevation-4">
        <v-btn
          v-perms="['system:menu:add']"
          rounded
          small
          color="primary"
          dark
          @click="addOrEdit({})"
        >
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn
          v-perms="['system:menu:edit']"
          rounded
          small
          class="ml-2"
          color="warning"
          :disabled="menu.menuId?false:true"
          @click="addOrEdit(menu)"
        >
          <v-icon dark>edit</v-icon>
        </v-btn>
        <v-btn
          v-perms="['system:menu:del']"
          rounded
          small
          class="ml-2"
          color="error"
          :disabled="menu.menuId?false:true"
          @click="delMenus()"
        >
          <v-icon dark>delete</v-icon>
        </v-btn>
      </v-card>
      <v-card class="elevation-4 mt-2">
        <v-scroll>
          <div style="height: calc(100vh - 480px)" class="pa-4">
            <menu-tree ref="menuTree" @clickNode="selectdItem" />
          </div>
        </v-scroll>
      </v-card>
    </v-col>
    <v-col cols="12" xl="8" lg="8" xs="12" sm="12">
      <v-card class="pa-3 elevation-4">
        <v-form ref="menu" :model="menu">
          <v-row class="pa-5" no-gutters>
            <v-col
              cols="12"
              lg="12"
              xs="12"
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
              lg="12"
              xs="12"
            >
              <v-text-field
                v-model="menu.menuId"
                disabled
                label="节点ID"
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
                v-model="menu.name"
                label="节点名称："
                :disabled="disabledFlag"
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
              <v-radio-group
                v-model="menu.menuType"
                label="节点类型："
                class="mt-2 ml-5"
                :disabled="disabledFlag"
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
              <v-text-field
                v-model="menu.orderNum"
                :disabled="disabledFlag"
                label="排序号"
                type="number"
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
              <v-switch
                v-model="menu.hidden"
                class="mt-2 ml-5"
                label="隐藏"
                color="primary"
                inset
                :disabled="disabledFlag"
              />
            </v-col>

            <v-col
              v-if="menu.menuType==0"
              cols="12"
              lg="12"
              xs="12"
            >
              <icon-field v-model="menu.icon" :disabled="disabledFlag" required />
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
                :disabled="disabledFlag"
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
              cols="12"
              lg="12"
              xs="12"
            >
              <v-text-field
                v-if="menu.menuType==0"
                v-model="menu.component"
                :disabled="disabledFlag"
                label="页面路径"
                class="small"
                outlined
                clearable
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon class="my-2 ml-1" v-on="on">mdi-help-circle-outline</v-icon>
                    </template>
                    vue文件在项目中相对views的路径,目录可不输
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col
              v-if="menu.menuType==0"
              cols="12"
              lg="12"
              xs="12"
            >
              <v-text-field
                v-model="menu.path"
                :disabled="disabledFlag"
                label="页面url"
                class="small"
                outlined
                clearable
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <small class="red-text my-4">*</small>
                      <v-icon class="my-1" v-on="on">mdi-help-circle-outline</v-icon>
                    </template>
                    菜单在地址栏显示的路径，推荐父菜单路径+子路径
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              xs="6"
              offset-xs="6"
              offset-lg="6"
            >
              <v-btn v-show="!disabledFlag" small color="success" @click="addOrEditSubmit()">
                <v-icon dark>done</v-icon>
                提交
              </v-btn>
              <v-btn v-show="!disabledFlag" small color="secondary" @click="addOrEditCancel()">
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
import { menuAddOrEdit, delMenu } from '@/api/system/menu'
import MenuTree from '@/views/components/menu/menuTree'
import IconField from '@/components/IconField'
export default {
  name: 'Menu',
  components: {
    MenuTree,
    IconField
  },
  data() {
    return {
      disabledFlag: true,
      menu: {},
      selectedTab: null
    }
  },
  methods: {
    /**
     * 添加或修改
     */
    addOrEdit(menu) {
      if (!menu.menuId) { // 添加
        if (!this.menu.menuId) {
          menu.parentId = 0
        } else {
          menu = {
            parentId: this.menu.menuId
          }
        }
        this.menu = menu
        this.$refs.menu.resetValidation()
      }
      this.disabledFlag = false
    },
    delMenus() {
      // eslint 忽略下一行
      // eslint-disable-next-line no-undef
      swal({
        title: '操作确认',
        text: '确认删除' + this.menu.name + '以及子节点吗?删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          delMenu(this.menu).then(res => {
            if (res.data.code === 200) {
              this.$refs.menuTree.getMenuList()
              this.menu = {}
              this.$refs.menu.reset()
              this.message.success(res.data.msg)
            } else {
              this.message.error(res.data.msg)
            }
          })
        }
      })
    },
    addOrEditSubmit() {
      if (this.$refs.menu.validate()) {
        menuAddOrEdit(this.menu).then(res => {
          if (res.data.code === 200) {
            this.message.success(res.data.msg)
            this.$refs.menuTree.getMenuList()
            this.disabledFlag = true
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
      this.menu = JSON.parse(JSON.stringify(item))
    }
  }
}
</script>
