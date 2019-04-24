<template>
  <div class="user-avator-dropdown">

    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>{{ nickName }}
      <!-- <p style="" >xxxx</p> -->
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changepasswrod">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
      <Modal v-model="modalVisible" title="修改密码" :loading=true :footer-hide=true>
      <Form ref="formCustom" :model="form" :rules="ruleCustom" :label-width="80">
        <FormItem label="旧密码" prop="oldPasswd">
            <Input type="password" v-model="form.oldPasswd"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPasswd">
            <Input type="password" v-model="form.newPasswd"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="passwdCheck">
            <Input type="password" v-model="form.passwdCheck"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
            <Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
        </FormItem>
      </Form>
      </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    nickName: {
      type: String,
      default: '张三'
    }
  },
  data () {
    const validateOldPasswd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateNewPasswd = (rule, value, callback) => {
      let regex = new RegExp(
        '(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}'
      )
      if (value === '') {
        callback(new Error('新密码不能为空'))
      } else if (!regex.test(value)) {
        return callback(
          new Error('密码至少为8位的字母、数字和特殊符号的组合，请重新输入!')
        )
      } else {
        if (this.form.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再一次输入你的密码'))
      } else if (value !== this.form.newPasswd) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      modalVisible: false,
      form: {
        newPasswd: '',
        passwdCheck: '',
        oldPasswd: ''
      },
      ruleCustom: {
        newPasswd: [{ validator: validateNewPasswd, trigger: 'blur' }],
        passwdCheck: [{ validator: validatePassCheck, trigger: 'blur' }],
        oldPasswd: [{ validator: validateOldPasswd, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['handleLogOut', 'handlePassword']),
    handleSubmit () {
      this.$refs.formCustom.validate(valid => {
        if (valid) {
          const dataInfo = {
            old_password: this.form.oldPasswd,
            new_password1: this.form.newPasswd,
            new_password2: this.form.passwdCheck
          }
          this.handlePassword(dataInfo).then(res => {
            if (res.code === 0) {
              this.$Message.success(`${res.msg}`)
              location.reload()
            } else {
              this.$Message.error(`${res.msg}`)
            }
          })
        } else {
          this.$Message.error('验证失败!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break
        case 'changepasswrod':
          this.modalVisible = true
          break
      }
    }
  }
}
</script>
