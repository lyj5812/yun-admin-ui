<template>
  <v-img class="login" :src="require('@/assets/images/gallery/bg-01.jpg')" :lazy-src="require('@/assets/images/gallery/bg-01.jpg')">
    <v-row
      align="center"
      justify="center"
      style="height: 100vh;"
    >
      <v-col lg="3" sm="4" xs="4" md="6">
        <v-row>
          <v-col cols="12">
            <v-card raised :class="['elevation-5','pa-3']">
              <v-card-text>
                <div class="layout column align-center">
                  <v-avatar size="80" class="avatar pa-2">
                    <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
                  </v-avatar>
                  <h2 class="ma-5">系统登录</h2>
                </div>
                <v-form ref="loginForm" :model="loginForm">
                  <v-text-field
                    v-model="loginForm.username"
                    append-icon="person"
                    :rules="[v => !!v || '请输入用户名!']"
                    name="login"
                    :label="$t('login.username')"
                    type="text"
                  />
                  <v-text-field
                    v-model="loginForm.password"
                    :append-icon="showPwd ? 'visibility' : 'visibility_off'"
                    :rules="[v => !!v || '请输入密码!']"
                    name="password"
                    :label="$t('login.password')"
                    :type="showPwd ? 'text' : 'password'"
                    @keyup.enter.native="handleLogin"
                    @click:append="showPwd =!showPwd"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn icon>
                  <v-icon color="blue">fa fa-wechat fa-lg</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color="red">fa fa-qq fa-lg</v-icon>
                </v-btn>
                <v-spacer />
                <v-btn width="30%" color="primary" :loading="loading" @click="handleLogin">{{
                  $t('login.logIn') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-img>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      showPwd: false,
      loading: false,
      redirect: undefined,
      flag: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  methods: {
    handleLogin() {
      if (this.$refs.loginForm.validate()) {
        this.loading = true
        this.$store.dispatch('user/login', this.loginForm).then(() => {
          this.loading = false
          this.$router.push({ path: this.redirect || '/' })
        }).catch(() => {
          this.loading = false
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    margin-top: -70px;
  }
</style>
