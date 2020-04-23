<template>
  <v-container>
    <v-card class="br-6 box-shadow mt-3 pt-5">
      <v-card-title class="b-left">通知公告表</v-card-title>
      <v-card-text>
        <v-data-table
          v-model="selected"
          :headers="th"
          :items="noticePage.records"
          hide-default-footer
          disable-pagination
          show-select
          item-key="noticeId"
          :loading="dataFlag"
          loading-text="加载中... 请稍后！"
        >
          <template v-if="noticePage.records&&noticePage.records.length===0" v-slot:body>
            <td :colspan="th.length+1">
              <v-row justify="center">
                <v-img max-height="200" class="ma-4" max-width="200" :src="require('@/assets/img/no-data.svg')" />
              </v-row>
            </td>
          </template>
          <template v-slot:top>
            <v-row>
              <v-col cols="auto" class="mr-auto">
                <v-btn x-small fab color="success" @click="noticeListPageData">
                  <v-icon dark>mdi-sync</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:notice:add']"
                  class="ml-2"
                  x-small
                  fab
                  color="primary"
                  @click="addOrEdit({})"
                >
                  <v-icon dark>add</v-icon>
                </v-btn>
                <v-btn
                  v-perms="['system:notice:export']"
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
                  v-perms="['system:notice:edit']"
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
                  v-perms="['system:notice:del']"
                  x-small
                  fab
                  color="error"
                  class="ml-2"
                  :disabled="selected.length<1"
                  @click="delList(selected)"
                >
                  <v-icon dark>delete</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn v-perms="['system:notice:search']" small text color="primary" dark @click="filterFlag=!filterFlag">
                  筛选
                  <v-icon dark>{{ filterFlag?'mdi-chevron-double-up':'mdi-chevron-double-down' }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider />
            <v-expand-transition>
              <div v-show="filterFlag">
                <v-row class="py-5" dense>
                  <v-col cols="12" xs="12" lg="2">
                    <v-text-field
                      v-model="page.noticeTitle"
                      label="公告标题"
                      dense
                      outlined
                      clearable
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" xs="12" lg="2">
                    <dict
                      v-model="page.noticeType"
                      outlined
                      dense
                      dict-type="sys_notice_type"
                    />
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" lg="1" offset-xs="9">
                    <v-btn v-perms="['system:notice:search']" color="primary" dark @click="noticeListPageData">
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
            <v-btn v-perms="['system:notice:edit']" fab x-small class="ma-1" color="success" @click="addOrEdit(item)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn v-perms="['system:notice:del']" fab x-small class="ma-1" color="error" @click="delList([item])">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <pagination
          :page-sizes="[10,20]"
          :page-data="noticePage"
          @pageChange="noticeListPage"
        />
      </v-card-text>
    </v-card>
    <!--通知公告表添加修改-->
    <v-form ref="notice" :model="notice">
      <v-dialog v-model="editFlag" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ notice.noticeId?'修改通知公告表':'添加通知公告表' }}</span>
            <v-spacer />
            <v-btn class="mx-0" icon @click.stop="editFlag = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row class="mt-4" no-gutters>
              <v-col cols="12" xs="12">
                <v-text-field
                  v-model="notice.noticeTitle"
                  dense
                  outlined
                  class="ml-4"
                  clearable
                  label="公告标题"
                />
              </v-col>
              <v-col cols="12" xs="12">
                <dict
                  v-model="notice.noticeType"
                  outlined
                  class="ml-4"
                  dense
                  dict-type="sys_notice_type"
                />
              </v-col>
              <v-col cols="12" xs="12">
                <v-textarea
                  v-model="notice.noticeContent"
                  outlined
                  class="ml-4"
                  label="公告内容"
                />
              </v-col>
              <v-col cols="12" xs="12">
                <v-text-field
                  v-model="notice.updateBy"
                  dense
                  outlined
                  class="ml-4"
                  clearable
                  label="更新者"
                />
              </v-col>
              <v-col cols="12" xs="12">
                <y-date-picker
                  ref="date"
                  v-model="notice.updateTime"
                  outlined
                  field-class="ml-4"
                  clearable
                  label="更新时间"
                  prepend-inner-icon="event"
                  dense
                >
                  <v-spacer />
                  <v-btn text color="primary" @click="$refs.date.menu=false">
                    确认
                  </v-btn>
                </y-date-picker>
              </v-col>
              <v-col cols="12" xs="12">
                <v-text-field
                  v-model="notice.remark"
                  dense
                  outlined
                  class="ml-4"
                  clearable
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
import { addOrEdit, noticeListPage, delList } from '@/api/system/notice'

export default {
  data() {
    return {
      noticePage: {},
      notice: {},
      selected: [], // 选中的行
      editFlag: false,
      dataFlag: false,
      filterFlag: false,
      th: [
        { text: '公告标题', align: 'center', sortable: true, value: 'noticeTitle' },
        { text: '公告类型（1通知 2公告）', align: 'center', sortable: true, value: 'noticeType' },
        { text: '公告内容', align: 'center', sortable: true, value: 'noticeContent' },
        { text: '公告状态（0正常 1关闭）', align: 'center', sortable: true, value: 'status' },
        { text: '备注', align: 'center', sortable: true, value: 'remark' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      page: {
        current: 1,
        size: 10
      }

    }
  },
  mounted() {
    this.noticeListPage(this.page)
  },
  methods: {
    /**
      * 通知公告表分页数据
      */
    noticeListPage(page) {
      this.page.size = page.size
      this.page.current = page.current
      this.noticeListPageData()
    },
    /**
     * 通知公告表分页数据接口
     */
    noticeListPageData() {
      this.dataFlag = true
      noticeListPage(this.page).then(res => {
        this.noticePage = res.data.data
        this.dataFlag = false
      })
    },
    /**
     * 打开模态框
     */
    addOrEdit(notice) {
      this.notice = notice
      if (!this.notice.noticeId) {
        this.$refs.notice.resetValidation()
      }
      this.editFlag = true
    },
    /**
     * 添加或者修改提交
     * @returns {boolean}
     */
    addOrEditSubmit() {
      if (this.$refs.notice.validate()) {
        addOrEdit(this.notice).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.editFlag = false
            this.noticeListPageData()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    delList(notices) {
      this.$confirm.fire({
        title: '操作确认?',
        text: '删除后，您将无法恢复!',
        icon: 'warning'
      }).then((result) => {
        if (result.value) {
          const ids = notices.map((n) => { return n.noticeId })
          delList(ids).then(res => {
            if (res.data.code === 200) {
              this.$confirm.fire(
                '删除成功!',
                '您要删除的已删除.',
                'success'
              )
              this.noticeListPageData()
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
    }
  }
}
</script>
