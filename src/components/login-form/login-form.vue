<template>
  <Form ref="loginForm" :model="form" :rules="rules"   @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem v-if="secoundAuth" prop="dynamic">
      <Input type="text" :maxlength=6 v-model="form.dynamic" autofocus="autofocus" placeholder="请输入动态码">
        <span slot="prepend">
          <Icon :size="14" type="md-key"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    secoundAuth: {
      type: Boolean,
      default: false
    },
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {type: 'string', min: 6, message: '密码不能小于6位', trigger: 'blur'}
        ]
      }
    },
    dynamicRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '动态码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, max: 6, message: '必须为六位数字', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: '',
        dynamic:''
      }
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules,
        dynamic: this.dynamicRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password,
            dynamic: this.form.dynamic
          })
        }
      })
    }
  }
}
</script>
