<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card class="elevation-4">
        <v-layout row wrap pa-5 ml-3>
          <v-flex xs12 lg2>
            <v-text-field
              v-model="page.postName"
              label="岗位名称"
              class="small"
              outlined
              clearable
              hide-details
            />
          </v-flex>
          <v-flex xs12 lg2 offset-lg1>
            <v-text-field
              v-model="page.postCode"
              label="岗位编码"
              class="small"
              outlined
              clearable
              hide-details
            />
          </v-flex>

          <v-flex xs12 lg2 offset-lg1>
            <dict v-model="page.status" dict-type="post_status" />
          </v-flex>

          <v-flex xs12 lg2 offset-lg1 offset-xs9>
            <v-btn v-perms="['system:post:search']" small class="mt-1" color="primary" dark @click="postListPageData()">
              <v-icon dark>search</v-icon>
              搜索
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-flex xs12 mt-2>
      <v-card class="elevation-4">
        <v-data-table
          v-model="selected"
          :headers="th"
          :items="postPage.records"
          hide-default-footer
          show-select
          item-key="postId"
          no-data-text="没有数据!"
        >
          <template v-if="postPage.records&&postPage.records.length===0" v-slot:body>
            <td :colspan="th.length+1">
              <v-layout class="justify-center">
                <v-img max-height="200" class="ma-4" max-width="200" :src="require('@/assets/images/table/no-data.svg')" />
              </v-layout>
            </td>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn v-perms="['system:post:add']" small color="primary" @click="addOrEdit({})">
                <v-icon dark>add</v-icon>
                添加
              </v-btn>
              <v-btn
                v-perms="['system:post:edit']"
                small
                color="warning"
                class="ml-2"
                :disabled="selected.length!=1"
                @click="addOrEdit(selected[0])"
              >
                <v-icon dark>edit</v-icon>
                修改
              </v-btn>
              <v-btn
                v-perms="['system:post:del']"
                small
                color="error"
                class="ml-2"
                :disabled="selected.length<1"
                @click="delPost(selected)"
              >
                <v-icon dark>delete</v-icon>
                删除
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.status="{ item }">
            {{ item.status==0?'正常':'停用' }}
          </template>
          <template v-slot:item.handle="{ item }">
            <v-btn v-perms="['system:post:edit']" small class="mt-2 mb-2" color="warning" @click="addOrEdit(item)">
              <v-icon dark>edit</v-icon>
              修改
            </v-btn>
            <v-btn v-perms="['system:post:del']" small class="mt-2 mb-2" color="error" @click="delPost([item])">
              <v-icon dark>delete</v-icon>
              删除
            </v-btn>
          </template>
        </v-data-table>
        <pagination
          :page-sizes="[10,20]"
          :page-data="postPage"
          @pageChange="postListPage"
        />
        <v-overlay absolute :value="dataFlag">
          加载中&nbsp;<v-progress-circular indeterminate color="primary" />
        </v-overlay>
      </v-card>
    </v-flex>
    <!--岗位添加修改-->
    <v-form ref="post" :model="post">
      <v-dialog v-model="editFlag" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ post.postId?'修改岗位':'添加岗位' }}</span>
          </v-card-title>
          <v-card-text>
            <v-layout wrap mt-4>
              <v-flex xs12>
                <v-text-field
                  v-model="post.postName"
                  class="small"
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入名称!']"
                  label="岗位名称"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="post.postCode"
                  class="small"
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入名称!']"
                  label="岗位编码"
                />
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="post.postSort"
                  class="small"
                  outlined
                  clearable
                  :rules="[v => !!v || '请输入顺序!']"
                  label="显示顺序"
                  type="number"
                />
              </v-flex>
              <v-flex xs12 offset-sm1 sm5>
                <v-switch
                  v-model="post.status"
                  label="状态正常"
                  color="primary"
                  inset
                  value="0"
                  :rules="[v => !!v || '请输入状态!']"
                  false-value="1"
                  true-value="0"
                  hide-details
                />
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="post.remark"
                  outlined
                  name="remark"
                  label="备注"
                />
              </v-flex>
            </v-layout>

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
  </v-layout>
</template>

<script>
import { addOrEdit, postListPage, deleteList } from '@/api/system/post'

export default {
  data() {
    return {
      postPage: [],
      post: {},
      selected: [],
      editFlag: false,
      dataFlag: false,
      th: [
        { text: '岗位编号', align: 'center', sortable: true, value: 'postId' },
        { text: '岗位编码', align: 'center', sortable: false, value: 'postCode' },
        { text: '岗位名称', align: 'center', sortable: false, value: 'postName' },
        { text: '显示顺序', align: 'center', sortable: true, value: 'postSort' },
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
            this.message.success(res.data.msg)
            this.editFlag = false
            this.postListPageData()
          } else {
            this.message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    delPost(posts) {
      // eslint-disable-next-line no-undef
      swal({
        title: '操作确认',
        text: '删除后，您将无法恢复！',
        icon: 'warning',
        buttons: ['取消', '确认']
      }).then((flag) => {
        if (flag) {
          deleteList(posts).then(res => {
            if (res.data.code === 200) {
              this.message.success(res.data.msg)
              this.postListPageData()
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
