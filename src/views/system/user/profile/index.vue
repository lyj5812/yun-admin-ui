<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="3" xs="12">
        <v-card class="br-6 box-shadow py-4">
          <v-card-title class="b-left">我的信息</v-card-title>

          <v-container fill-height fluid class="pa-4">
            <v-row justify="center">
              <v-hover v-slot:default="{ hover }">
                <v-avatar size="125px" class="grey lighten-4 " :class="{'v-card--reveal':hover}">
                  <img :src="user.avatar" alt="avatar">
                  <v-btn v-if="hover" dark icon class="show-btns" @click="imgFlag=true">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-avatar>
              </v-hover>
            </v-row>
            <v-row justify="center" class="mt-3">
              <div class="subtitle-2 font-weight-bold">{{ sysUser.name }}</div>
            </v-row>
          </v-container>
          <v-card-text />
        </v-card>
        <v-card class="br-6 box-shadow py-4 mt-4">
          <v-tabs
            v-model="tab"
            vertical
            class="mr-5"
          >
            <v-tab href="#tab-1">
              <v-row justify="start" class="ml-5">
                <v-icon left>mdi-account-box</v-icon>
                个人信息
              </v-row>
            </v-tab>
            <v-tab href="#tab-2">
              <v-row justify="start" class="ml-5">
                <v-icon left>mdi-account-box</v-icon>
                密码管理
              </v-row>

            </v-tab>
          </v-tabs>
        </v-card>
      </v-col>
      <v-col cols="12" lg="9" xs="12">
        <v-card class="br-6 box-shadow">
          <v-tabs-items v-model="tab">
            <v-tab-item
              value="tab-1"
              class="py-4"
            >
              <v-card-title class="b-left">个人信息</v-card-title>
              <v-form ref="user" :model="user" class="pa-4">
                <v-text-field
                  v-model="user.realName"
                  :rules="[() => !!user.realName || '用户名称必填']"
                  label="用户名称"
                  placeholder="请输入用户名称！"
                />
                <v-text-field
                  v-model="user.email"
                  :rules="[v => !!v || '邮箱是必填的',
                           v => /.+@.+\..+/.test(v) || '请输入正确的邮箱' ]"
                  label="邮箱"
                  placeholder="请输入邮箱！"
                />
                <v-text-field
                  v-model="user.phonenumber"
                  :rules="[v => !!v || '手机号必填',
                           v => /^[1]([3-9])[0-9]{9}$/.test(v) || '请输入正确的手机号']"
                  label="手机号"
                  placeholder="请输入手机号！"
                />
                <v-radio-group
                  v-model="user.sex"
                  label="性别"
                  class="ml-0 mt-n1"
                  :rules="[v => !!v || '请选择状态!']"
                  row
                >
                  <v-radio
                    label="男"
                    color="orange darken-2"
                    value="1"
                  />
                  <v-radio
                    label="女"
                    color="indigo"
                    value="0"
                  />
                </v-radio-group>
                <v-card-actions>
                  <v-btn small color="success" @click="editUser()">
                    <v-icon dark>done</v-icon>
                    保存
                  </v-btn>
                  <v-btn small color="secondary" class="ml-2" to="/dashboard">
                    <v-icon dark>close</v-icon>
                    取消
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-tab-item>
            <v-tab-item
              value="tab-2"
              class="py-4"
            >
              <v-card-title class="b-left">修改密码</v-card-title>
              <v-form ref="pwd" class="pa-4">
                <v-text-field
                  v-model="oldPwd"
                  type="password"
                  :rules="[v => !!v || '请输入旧密码']"
                  label="旧密码"
                  placeholder="请输入旧密码！"
                />
                <v-text-field
                  v-model="newPwd"
                  :rules="[v => !!v || '请输入新密码']"
                  label="新密码"
                  type="password"
                  placeholder="请输入新密码！"
                />
                <v-text-field
                  v-model="reNewPwd"
                  :rules="[() => !!reNewPwd || '请确认新密码',newPwd == reNewPwd || '新密码不一致']"
                  label="确认新密码"
                  type="password"
                  placeholder="请确认新密码"
                  required
                />
                <v-card-actions>
                  <v-btn small color="success" @click="editPassword()">
                    <v-icon dark>done</v-icon>
                    保存
                  </v-btn>
                  <v-btn small color="secondary" class="ml-2" to="/dashboard">
                    <v-icon dark>close</v-icon>
                    取消
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col cols="12" lg="9" xs="12">
        <v-card class="br-6 box-shadow">
          <y-uploader />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import YUploader from '@/components/YUploader'
import { editPwd, userEdit } from '@/api/system/user'
import { getUserInfo } from '@/api/login'
export default {
  components: {
    YUploader
  },
  data() {
    return {
      imgFlag: false,
      tab: null,
      user: {},
      newPwd: null,
      reNewPwd: null,
      oldPwd: null
    }
  },
  computed: {
    ...mapGetters({
      sysUser: 'user/user'
    })
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    editPassword() {
      if (this.$refs.pwd.validate()) {
        editPwd({ oldPassword: this.oldPwd, newPassword: this.newPwd }).then(res => {
          this.$message.success(res.data.msg)
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    uploadSuccess(data) {
      this.editUser()
      this.user.avatar = data.data
    },
    loadUserInfo() {
      getUserInfo().then(res => {
        this.user = res.data.data.sysUser
      })
    },
    editUser() {
      if (this.$refs.user.validate()) {
        userEdit(this.user).then(res => {
          this.$message.success(res.data.msg)
        })
      } else {
        console.log('error submit!!')
        return false
      }
    }
  }
}
</script>
<style scoped lang="scss">
    .show-btns {
        position: fixed;
    }

    .v-card--reveal {
        opacity: .5;
    }

    ::v-deep .v-tabs .v-item-group{
        width: 100%;
        .v-tab{
            max-width: 100%;
        }
    }
</style>
