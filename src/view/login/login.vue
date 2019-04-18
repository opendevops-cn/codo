<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录codo系统" :bordered="false">
        <div class="form-con">
          <login-form :secoundAuth=secoundAuth @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">支持 本地 e-mail LDAP登录</p>
        </div>
      </Card>
    </div>
    <Modal v-model="modalVisible"  :title="modalTitle" :loading=true :footer-hide=true :mask-closable=false>
      <register-form v-if="!mfa" :mail="mail" :username='username' @on-submit-success="handleRegisterSubmit"></register-form>
      <m-f-a  v-else :mfa="mfa" :mail="mail" ></m-f-a>
    </Modal>
  </div>
</template>

<script>
import { LoginForm,LoginMFA, RegisterForm, MFA } from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm,
    LoginMFA,
    RegisterForm,
    MFA
  },
  data () {
    return {
      secoundAuth: false,
      modalVisible: false,
      modalTitle: '',
      mail: '',
      username: '',
      mfa: ''
    }
  },

  methods: {
    ...mapActions(['handleLogin', 'handleRegister']),
    handleSubmit ({ username, password, dynamic }) {
      const nextUrl = this.$route.query.next_url
        ? this.$route.query.next_url
        : ''
      this.handleLogin({ username, password, dynamic}).then(res => {
        if (res.code === 0) {
          this.$Message.success(`${res.msg}`)
          this.$router.push({
            name: this.$config.homeName
          })
        } else if (res.code === 1) {
          // 这里弹出二次认证
          this.secoundAuth = true
          this.$Message.success(`${res.msg}`)
        }  else if (res.code === -3) {
          this.mail = res.email ? res.email : username
          this.username = res.username ? res.username : username.split('@')[0]
          this.$Message.success({
            content: `${res.msg}`,
            duration: 5,
            closable: true
          })
          this.modalVisible = true
          this.modalTitle = '注册用户'
          // 邮箱认证通过，请根据邮箱完善用户信息
        } else {
          this.$Message.error({
            content: `${res.msg}`,
            duration: 5,
            closable: true
          })
        }
      })
    },
    handleRegisterSubmit (data) {
      this.handleRegister(JSON.stringify(data)).then(res => {
        if (res.code === 0) {
          this.modalTitle = '动态密钥，非常重要'
          this.mfa = res.mfa.trim()
        } else {
          this.$Message.error({
            content: `${res.msg}`,
            duration: 3,
            closable: true
          })
          this.$router.push({ name: 'login' })
        }
      })
    }
  }
}
</script>

<style>
</style>
