<template>
  <v-img :src="require('@/assets/img/hero-bg/hero-6.jpg')" :lazy-src="require('@/assets/img/hero-bg/hero-6.jpg')">
    <v-row
      align="center"
      justify="center"
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
                <div>
                  <h2 class="ma-5 layout column align-center">系统登录</h2>
                  <v-form ref="loginForm" :model="loginForm">
                    <v-text-field
                      v-model="loginForm.username"
                      append-icon="person"
                      :rules="[v => !!v || '请输入用户名!']"
                      name="login"
                      label="用户名"
                      type="text"
                    />
                    <v-text-field
                      v-model="loginForm.password"
                      :append-icon="showPwd ? 'visibility' : 'visibility_off'"
                      :rules="[v => !!v || '请输入密码!']"
                      name="password"
                      label="密码"
                      :type="showPwd ? 'text' : 'password'"
                      @keyup.enter.native="handleLogin"
                      @click:append="showPwd =!showPwd"
                    />
                  </v-form>
                </div>
              </v-card-text>
              <v-card-actions>
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
                <v-btn width="30%" color="primary" :loading="loading" @click="handleLogin">
                  登录
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
      loginType: 'password',
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
    }
  }
}
</script>
<style lang="scss" scoped>
    .avatar {
      margin-top: -70px;
    }
</style>
