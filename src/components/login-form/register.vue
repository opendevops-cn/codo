<template>
  <!-- <Row style="padding:10px;">
    <Col span="14" offset="0"> -->
      <!-- <Card> -->
        <!-- <p slot="title">完善用户信息</p> -->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="用户名称" prop="username">
            <Input readonly v-model="formValidate.username" placeholder=""></Input>
          </FormItem>
          <FormItem label="用户昵称" prop="nickname">
            <Input v-model="formValidate.nickname" placeholder="请输入用户姓名"></Input>
          </FormItem>
          <FormItem label="用户密码" prop="password">
            <Input type ="password" v-model="formValidate.password" placeholder="密码不能小于8位，必须包含数字，英文大小写，特殊符号"></Input>
          </FormItem>
          <FormItem label="部门" prop="department">
            <Input v-model="formValidate.department" placeholder="Enter your department"></Input>
          </FormItem>
          <FormItem label="手机" prop="tel">
            <Input v-model="formValidate.tel" placeholder="Enter your tel"></Input>
          </FormItem>
          <FormItem label="微信" prop="wechat">
            <Input v-model="formValidate.wechat" placeholder="Enter your wechat"></Input>
          </FormItem>
          <FormItem label="工号" prop="no">
            <Input v-model="formValidate.no" placeholder="请输入你的工号"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input readonly v-model="formValidate.email" disabled  placeholder="Enter your e-mail "></Input>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formValidate.sex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="简介" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 5,maxRows: 8}" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 10px">重置</Button>
          </FormItem>
        </Form>
      <!-- </Card> -->
    <!-- </Col span="25">
  </Row> -->
</template>
<script>
export default {
  name: 'RegisterForm',
  props: {
    mail: {
      type: String
    },
    username: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      formValidate: {
        username: '',
        nickname: '18888888888',
        password: '18888888888',
        department: '18888888888',
        tel: '18888888888',
        wechat: '18888888888',
        no: '18888888888',
        email: ''
        // sex: "",
        // desc: ""
      },
      ruleValidate: {
        username: [
          {
            required: true,
            message: 'The username cannot be empty',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 3,
            max: 20,
            message: '不能超过20个字符',
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: true,
            message: 'The nickname cannot be empty',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'The password cannot be empty',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 8,
            message: '密码不能小于8位',
            trigger: 'blur'
          }
        ],
        department: [
          {
            required: true,
            message: 'The department cannot be empty',
            trigger: 'blur'
          }
        ],
        tel: [
          {
            required: true,
            message: 'The tel cannot be empty',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 11,
            max: 11,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        wechat: [
          {
            required: true,
            message: '微信号不能为空',
            trigger: 'blur'
          }
        ],
        no: [
          {
            required: true,
            message: '工号不能为空',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    mail (value) {
      this.formValidate.email = value
    },
    username (value) {
      this.formValidate.username = value
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$emit('on-submit-success', this.formValidate)
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 1000)
        } else {
          this.$Message.error('Validate Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
