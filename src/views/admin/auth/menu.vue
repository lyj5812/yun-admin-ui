<template>
  <v-layout row wrap>
    <v-flex xl4 lg4 xs12 sm12>
      <v-card class="pa-2 mt-2 mr-1 elevation-4">
        <v-btn
          v-perms="['system:menu:add']"
          small
          color="primary"
          dark
          @click="addOrEdit({})"
        >
          <v-icon dark>add</v-icon>
          添加
        </v-btn>
        <v-btn
          v-perms="['system:menu:edit']"
          small
          color="warning"
          :disabled="menu.menuId?false:true"
          @click="addOrEdit(menu)"
        >
          <v-icon dark>edit</v-icon>
          修改
        </v-btn>
        <v-btn
          v-perms="['system:menu:del']"
          small
          color="error"
          :disabled="menu.menuId?false:true"
          @click="delMenus()"
        >
          <v-icon dark>delete</v-icon>
          删除
        </v-btn>
      </v-card>

      <v-card class="mt-2 mr-1 elevation-4">
        <v-scroll>
          <div style="height: 530px" class="pa-4 mr-1">
            <menu-tree ref="menuTree" @clickNode="selectdItem" />
          </div>
        </v-scroll>
      </v-card>

    </v-flex>
    <v-flex xl8 lg8 xs12 sm12>
      <v-card class="pa-3 mt-2 elevation-4">
        <v-form ref="menu" :model="menu">
          <v-layout row wrap pa-5>
            <v-flex
              lg12
              xs12
            >
              <v-text-field
                v-model="menu.parentId"
                disabled
                label="父节点ID"
                class="small"
                outlined
              />
            </v-flex>
            <v-flex
              lg12
              xs12
            >
              <v-text-field
                v-model="menu.menuId"
                disabled
                label="节点ID"
                class="small"
                outlined
              />
            </v-flex>
            <v-flex
              lg6
              xs6
            >
              <v-text-field
                v-model="menu.name"
                :disabled="disabledFlag"
                :rules="[v => !!v || '请输入名称!']"
                label="节点名称"
                class="small"
                outlined
                clearable
              />
            </v-flex>
            <v-flex lg6 xs6>
              <v-radio-group
                v-model="menu.menuType"
                label="节点类型："
                class="mt-1 ml-5"
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
            </v-flex>
            <v-flex
              lg6
              xs6
            >
              <v-text-field
                v-model="menu.orderNum"
                :disabled="disabledFlag"
                label="排序号"
                type="number"
                class="small"
                outlined
                clearable
              />
            </v-flex>
            <v-flex lg6 xs6>
              <v-switch
                v-model="menu.hidden"
                class="mt-1 ml-5"
                label="隐藏"
                color="primary"
                inset
                :disabled="disabledFlag"
              />
            </v-flex>

            <v-flex
              v-if="menu.menuType==0"
              lg12
              xs12
            >
              <v-text-field
                v-model="menu.icon"
                :prepend-inner-icon="menu.icon"
                :disabled="disabledFlag"
                label="节点图标"
                class="small"
                outlined
                clearable
                @focus="showIcon()"
              />
              <v-layout
                v-if="iconFlag"
                row
                wrap
                style="margin-top: -30px;"
              >
                <v-flex xs12>
                  <v-tabs
                    v-model="selectedTab"
                    color="grey lighten-3"
                  >
                    <v-tab href="#tab-1">
                      Matrial Icons
                    </v-tab>
                    <v-tab
                      ripple
                      href="#tab-2"
                    >
                      Font Awesome
                    </v-tab>
                    <v-tabs-items v-model="selectedTab">
                      <v-tab-item value="tab-1">
                        <v-card flat>
                          <v-card-text>
                            <v-layout
                              row
                              wrap
                            >
                              <v-flex
                                v-for="(item, index) in material"
                                :key="index"
                                xs1
                                md1
                                style="cursor: pointer;"
                                @click="selectIcon(item.ligature)"
                              >
                                <v-icon medium>{{ item.ligature }}</v-icon>
                              </v-flex>
                            </v-layout>
                            <v-pagination
                              v-model="materialPage.page"
                              :length="materialPage.pageCount"
                              :total-visible="8"
                              circle
                            />
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item value="tab-2">
                        <v-card flat>
                          <v-card-text>
                            <v-layout
                              row
                              wrap
                            >
                              <v-flex
                                v-for="(item, index) in ft"
                                :key="index"
                                xs1
                                md1
                                style="cursor: pointer;"
                                @click="selectIcon(item)"
                              >
                                <v-icon medium>{{ item }}</v-icon>
                              </v-flex>
                            </v-layout>
                            <v-pagination
                              v-model="fontPage.page"
                              :length="fontPage.pageCount"
                              :total-visible="8"
                              circle
                            />
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-tabs>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex
              lg12
              xs12
            >
              <v-text-field
                v-if="menu.menuType==1"
                v-model="menu.perms"
                :disabled="disabledFlag"
                label="权限标识"
                :rules="[v => !!v || '请输入标识!']"
                class="small"
                outlined
                clearable
              />
            </v-flex>
            <v-flex
              xs12
              md12
            >
              <v-text-field
                v-if="menu.menuType==0"
                v-model="menu.component"
                :disabled="disabledFlag"
                label="页面路径"
                class="small"
                outlined
                clearable
              />
            </v-flex>
            <v-flex
              v-if="menu.menuType==0"
              xs12
              md12
            >
              <v-text-field
                v-model="menu.path"
                :disabled="disabledFlag"
                label="页面url"
                class="small"
                outlined
                clearable
              />
            </v-flex>
            <v-flex xs6 md6 offset-xs6>
              <v-btn v-show="!disabledFlag" small color="success" @click="addOrEditSubmit()">
                <v-icon dark>done</v-icon>
                提交
              </v-btn>
              <v-btn v-show="!disabledFlag" small color="secondary" @click="addOrEditCancel()">
                <v-icon dark>close</v-icon>
                取消
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { menuAddOrEdit, delMenu } from '@/api/system/menu'
import fontData from '@/api/font-awesome.json'
import materialData from '@/api/material.json'
import MenuTree from '@/views/components/menu/menuTree'
export default {
  components: {
    MenuTree
  },
  data() {
    return {
      disabledFlag: true,
      menu: {},
      selectedTab: null,
      material: null,
      ft: null,
      iconFlag: false,
      fontPage: {
        page: 1,
        pageSize: 60,
        pageCount: 0
      },
      materialPage: {
        page: 1,
        pageSize: 60,
        pageCount: 0
      }
    }
  },
  computed: {
    materialPageChange() {
      return this.materialPage.page
    }
  },
  watch: {
    materialPageChange() {
      console.log(this.materialPage.page)
      const start = (this.materialPage.page - 1) * this.materialPage.pageSize
      const end = start + this.materialPage.pageSize
      this.material = materialData.icons.slice(start, end)
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
    },
    showIcon() {
      this.ft = fontData['4.7.0'].slice(0, 60)
      this.materialPage.pageCount = Math.ceil(materialData.icons.length / this.fontPage.pageSize)
      this.materialPage.page = 1
      this.material = materialData.icons.slice(0, 60)
      this.iconFlag = true
    },
    selectIcon(icon) {
      this.menu.icon = icon
      this.iconFlag = false
    }
  }
}
</script>
