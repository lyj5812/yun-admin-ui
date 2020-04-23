<template>
  <v-container>
    <v-card class="br-6 box-shadow mt-3 pt-5">
      <v-card-title class="b-left">岗位管理</v-card-title>
      <v-card-text>
        <v-data-table
          v-model="selected"
          :headers="th"
          :items="postPage.records"
          hide-default-footer
          show-select
          item-key="postId"
          :loading="dataFlag"
          loading-text="加载中... 请稍后！"
        >
          <template v-if="postPage.records&&postPage.records.length===0" v-slot:body>
            <td :colspan="th.length+1">
              <v-row justify="center">
                <v-img max-height="200" class="ma-4" max-width="200" :src="require('@/assets/img/no-data.svg')" />
              </v-row>
            </td>
          </template>
          <template v-slot:top>
            <v-row>
              <v-col cols="auto" class="mr-auto">
                <v-btn
                  fab
                  x-small
                  color="success"
                  @click="postListPageData"
                >
                  <v-icon dark>mdi-sync</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:post:add']"
                  class="ml-2"
                  fab
                  x-small
                  color="primary"
                  @click="addOrEdit({})"
                >
                  <v-icon dark>add</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:post:export']"
                  fab
                  x-small
                  color="info"
                  class="ml-2"
                  :disabled="selected.length<1"
                  @click="exportExcel()"
                >
                  <v-icon dark>mdi-export-variant</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:post:edit']"
                  fab
                  x-small
                  color="warning"
                  class="ml-2"
                  :disabled="selected.length!=1"
                  @click="addOrEdit(selected[0])"
                >
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:post:del']"
                  fab
                  x-small
                  color="error"
                  class="ml-2"
                  :disabled="selected.length<1"
                  @click="delPost(selected)"
                >
                  <v-icon dark>delete</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn v-perms="['system:role:search']" small text color="primary" dark @click="filterFlag=!filterFlag">
                  筛选
                  <v-icon dark>{{ filterFlag?'mdi-chevron-double-up':'mdi-chevron-double-down' }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider />
            <v-expand-transition>
              <div v-show="filterFlag">
                <v-row class="pt-5" dense>
                  <v-col cols="12" xs="12" lg="2">
                    <v-text-field
                      v-model="page.postName"
                      label="岗位名称"
                      dense
                      outlined
                      clearable
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" xs="12" lg="2">
                    <v-text-field
                      v-model="page.postCode"
                      label="岗位编码"
                      dense
                      outlined
                      clearable
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" xs="12" lg="2">
                    <dict
                      v-model="page.status"
                      dense
                      outlined
                      dict-type="post_status"
                    />
                  </v-col>

                  <v-col cols="12" xs="12" lg="1" offset-xs="9">
                    <v-btn v-perms="['system:post:search']" color="primary" dark @click="postListPageData()">
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
            <v-btn v-perms="['system:post:edit']" fab x-small class="ma-1" color="success" @click="addOrEdit(item)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn v-perms="['system:post:del']" fab x-small class="ma-1" color="error" @click="delPost([item])">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <pagination
          :page-sizes="[10,20]"
          :page-data="postPage"
          @pageChange="postListPage"
        />
      </v-card-text>
    </v-card>
    <!--岗位添加修改-->
    <v-form ref="post" :model="post">
      <v-dialog v-model="editFlag" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ post.postId?'修改岗位':'添加岗位' }}</span>
          </v-card-title>
          <v-card-text>
            <v-row class="mt-4" no-gutters>
              <v-col cols="12" xs="12">
                <v-text-field
                  v-model="post.postName"
                  dense
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入名称!']"
                  label="岗位名称"
                >
                  <template v-slot:prepend>
                    <small class="red--text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12">
                <v-text-field
                  v-model="post.postCode"
                  dense
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入名称!']"
                  label="岗位编码"
                >
                  <template v-slot:prepend>
                    <small class="red--text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6">
                <v-text-field
                  v-model="post.postSort"
                  dense
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入顺序!']"
                  label="显示顺序"
                  type="number"
                >
                  <template v-slot:prepend>
                    <small class="red--text my-4">*</small>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" offset-sm="1" sm="5">
                <v-switch
                  v-model="post.status"
                  label="状态正常"
                  color="primary"
                  inset
                  value="0"
                  false-value="1"
                  true-value="0"
                  hide-details
                  class="mt-1"
                />
              </v-col>
              <v-col cols="12" xs="12">
                <v-textarea
                  v-model="post.remark"
                  outlined
                  name="remark"
                  class="ml-4"
                  label="备注"
                />
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
import { addOrEdit, postListPage, deleteList } from '@/api/system/post'

export default {
  data() {
    return {
      postPage: {},
      post: {},
      selected: [], // 选中的数组
      editFlag: false,
      dataFlag: false,
      filterFlag: false,
      th: [
        { text: '岗位编号', align: 'center', sortable: true, value: 'postId' },
        { text: '岗位编码', align: 'center', sortable: false, value: 'postCode' },
        { text: '岗位名称', align: 'center', sortable: false, value: 'postName' },
        { text: '排序', align: 'center', sortable: true, value: 'postSort' },
        { text: '状态', align: 'center', sortable: false, value: 'status' },
        { text: '创建时间', align: 'center', sortable: true, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      page: {
        current: 1,
        size: 10,
        postName: null,
        postCode: null,
        status: null
      }

    }
  },
  mounted() {
    this.postListPage(this.page)
  },
  methods: {
    /**
       * 岗位分页数据
       */
    postListPage(page) {
      this.page.size = page.size
      this.page.current = page.current
      this.postListPageData()
    },
    /**
       * 岗位分页数据接口
       */
    postListPageData() {
      this.dataFlag = true
      postListPage(this.page).then(res => {
        this.postPage = res.data.data
        this.dataFlag = false
      })
    },
    /**
       * 打开模态框
       */
    addOrEdit(post) {
      this.post = post
      if (!this.post.postId) {
        this.$refs.post.resetValidation()
        this.post.status = '0'
      }
      this.editFlag = true
    },
    /**
       * 添加或者修改提交
       * @returns {boolean}
       */
    addOrEditSubmit() {
      if (this.$refs.post.validate()) {
        addOrEdit(this.post).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.editFlag = false
            this.postListPageData()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    delPost(posts) {
      this.$confirm.fire({
        title: '操作确认?',
        text: '删除后，您将无法恢复！',
        icon: 'warning'
      }).then((result) => {
        if (result.value) {
          deleteList(posts).then(res => {
            if (res.data.code === 200) {
              this.$confirm.fire(
                '删除成功!',
                '您要删除的已删除.',
                'success'
              )
              this.postListPageData()
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
