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
                </div>
                <div v-if="!wx.flag">
                  <h2 class="ma-5 layout column align-center">系统登录</h2>
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
                </div>

              </v-card-text>
              <v-card-actions v-if="!wx.flag">
                <v-chip-group
                  v-model="loginType"
                  active-class="deep-purple--text text--accent-4"
                  mandatory
                >
                  <v-chip
                    class="ma-2"
                    color="green"
                    value="wechat"
                  >
                    <v-icon color="white">fa fa-wechat fa-lg</v-icon>
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    color="black"
                    value="qq"
                  >
                    <v-icon color="white">fa fa-qq fa-lg</v-icon>
                  </v-chip>
                </v-chip-group>
                <v-spacer />
                <v-btn width="30%" color="primary" :loading="loading" @click="handleLogin">{{
                  $t('login.logIn') }}
                </v-btn>
              </v-card-actions>
              <wxlogin
                v-if="loginType=='wechat'"
                class="layout column align-center"
                :state="wx.state"
                :appid="wx.appid"
                :scope="wx.scope"
                :redirect_uri="wx.redirect_uri"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-img>
</template>

<script>
import wxlogin from 'vue-wxlogin'
export default {
  name: 'Login',
  components: {
    wxlogin
  },
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginType: 'password',
      wx: {
        flag: false,
        appid: 'wxd1678d3f83b1d83a',
        scope: 'snsapi_login',
        state: 'WX-LOGIN',
        redirect_uri: 'https://pigx.pig4cloud.com'
      },
      showPwd: false,
      tab: null,
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
    socialLogin(type) {
      if (type === 'wechat') {
        this.wx.flag = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    margin-top: -70px;
  }
</style>
