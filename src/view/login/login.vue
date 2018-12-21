<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录xx系统" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">可以使用邮箱登录</p>
        </div>
      </Card>
    </div>
    <Modal v-model="modalVisible"  :title="modalTitle" :loading=true :footer-hide=true>
      <register-form v-if="!mfa" :mail="mail" @on-submit-success="handleRegisterSubmit"></register-form>
      <m-f-a  v-else :mfa="mfa" :mail="mail" ></m-f-a>
    </Modal>
  </div>
</template>

<script>
import { LoginForm, RegisterForm, MFA } from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm,
    RegisterForm,
    MFA
  },
  data () {
    return {
      modalVisible: false,
      modalTitle: '',
      mail: '',
      mfa: ''
    }
  },

  methods: {
    ...mapActions(['handleLogin', 'handleRegister']),
    handleSubmit ({ username, password, dynamic }) {
      const nextUrl = this.$route.query.next_url
        ? this.$route.query.next_url
        : ''
      this.handleLogin({ username, password, dynamic, nextUrl }).then(res => {
        if (res.code === 0) {
          this.$Message.success(`${res.msg}`)
          this.$router.push({
            name: this.$config.homeName
          })
        } else if (res.code === -3) {
          this.mail = username
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
