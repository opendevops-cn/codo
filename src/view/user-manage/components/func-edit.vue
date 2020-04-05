<template>
  <Drawer v-model="modalEditData.show" :closable="false"  style="background-color: #f8f8f9" width="800">
  
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" :label-colon=true >

        <FormItem label="权限名称" prop="func_name">
          <Input v-model="formValidate.func_name" maxlength="50" type="text"  placeholder="请输入API名称..."></Input>
        </FormItem>

        <FormItem label="所在应用" prop="app_code">
          <Input v-model="formValidate.app_code" maxlength="30" type="text"  placeholder="请输入API名称..."></Input>
        </FormItem>

        <FormItem label="请求方法" prop="method_type">
          <Select v-model="formValidate.method_type" placeholder="请求方法">
            <template v-for="method in methodsList">
              <Option :value="method" :label="method"></Option>
            </template>
          </Select>
        </FormItem>
        
        <FormItem label="请求路径" prop="uri">
          <Input v-model="formValidate.uri" maxlength="30" type="text"  placeholder="请输入API的uri路径..."></Input>
        </FormItem>
        
          <FormItem label="用法、参数" prop="parameters" >
            <editor v-model="formValidate.parameters" @init="editorInit" :mode_type="mode_type" :read="editor.read"  :editorHeight=700 :key="`${_uid}`" ></editor>
          </FormItem>
        <FormItem>
          <Button type="primary" :loading="btnLoading"  @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handlerReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>

  </Drawer>
</template>

<script>
import editor from '@/components/public/editor'
import { operationFunc } from '@/api/user'
export default {
  components: {editor},
  name: 'funcEdit',
  props: {
    modalEditData: {
        type :Object,
        default: {}
    },
    
    funcData: {
        type :Object,
        default: {}
    }
  },
  data () {
    return {
      mode_type: 'python',
      editor:{
        title: '编辑',
        read: false,
        color: "primary"
      },
      methodsList:['GET', 'POST','PUT','PATCH','DELETE','ALL'],
      btnLoading: false,
      formValidate: {
          func_name: '',
          method_type: '',
          app_code: '',
          uri: '',
          parameters:'暂无',
      },
        ruleValidate: {
          func_name: [{ required: true, message: 'The  name cannot be empty', trigger: 'blur' }],
          app_code: [{ required: true, message: '所在应用不能为空', trigger: 'blur' }],
          // uri: [{ required: true, message: 'URI不能为空', trigger: 'blur' }],
          method_type: [{ required: true, message: 'Cannot be empty', trigger: 'change' }],
          uri: [{ required: true, message: 'URI不能为空', trigger: 'blur' }]
        }
    }
  },
  methods: {
    handleCancel () {
      this.$emit('modal-close')
    },

    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            setTimeout(() => {
                operationFunc(this.formValidate, this.modalEditData.action).then(res => {
                  if (res.data.code == 0) {
                      this.modalEditData.show = false
                      this.btnLoading = false
                      this.handleCancel()
                  } else {
                      this.$Message.error({
                          content: JSON.stringify(res.data.msg),
                          duration: 3
                      })
                  }}).catch(error => {
                      this.$Message.error({
                          content: JSON.stringify(error.response.data),
                          duration: 10
                      })
                  })
                  this.btnLoading = false
              }, 2000)
          } else {
              this.$Message.error('表单校验不通过!');
          }
      })
    },
    handlerReset (name) {
        this.$refs[name].resetFields();
    },
     //
    editorInit: function () {
      require(`brace/mode/${this.mode_type}`)    //language
      require('brace/theme/terminal')
      require('brace/theme/xcode')
    },
  },
  //
  watch: {
    funcData (value) {
      this.formValidate = value
    }
  },
  //
  mounted() {
  }
  //
}
</script>