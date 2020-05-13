<template>
  <Modal width="700px;" v-model="modalEditData.show" :title="modalEditData.title" :footer-hide=true>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" :label-colon=true >

        <FormItem label="域名名称" prop="domain_name">
          <template v-if="modalEditData.action == 'put'">
            <p> {{formValidate.domain_name}}</p>
          </template>
          <template v-else>
            <Input v-model="formValidate.domain_name" maxlength="80" type="text"  placeholder="请输入域名名称..."></Input>
          </template>
        </FormItem>


         <FormItem label="备注信息" prop="remark">
          <Input v-model="formValidate.remark" maxlength="250" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="备注信息..."></Input>
        </FormItem>

        <FormItem label="过期时间" prop="record_end_time">
          <DatePicker type="date" :options="optionsDate" placeholder="备注域名到期时间" v-model="formValidate.record_end_time"  style="width: 280px"></DatePicker>
        </FormItem>

        <FormItem>
          <Button type="primary" :loading="btnLoading"  @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handlerReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { operationDomain }  from '@/api/domain/domain.js'
export default {
  name: 'domainEdit',
  props: {
    modalEditData: {
        type :Object,
        default: {}
    },
    domainData: {
        type :Object,
        default: {}
    }
  },
  data () {
    return {
      optionsDate: {
        shortcuts: [
            {
                text: '今天',
                value () {
                    return new Date();
                }
            } ]
        },
        btnLoading: false,
        formValidate: {
            id:'',
            domain_name: '',
            remark: '',
            record_end_time: ''
        },
        ruleValidate: {
          domain_name: [{ required: true, message: 'The domain name cannot be empty', trigger: 'blur' }],
          is_used: [{ required: true, message: 'Cannot be empty', trigger: 'change' }],
          remark: [{ required: true, message: '备注信息不能为空', trigger: 'blur' }]
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
                let formData
                if ( this.modalEditData.action === 'put') {
                  formData = {
                    id: this.formValidate.id,
                    remark: this.formValidate.remark,
                    record_end_time: this.formValidate.record_end_time,
                  }
                } else {
                  formData = {
                    domain_name: this.formValidate.domain_name,
                    remark: this.formValidate.remark,
                    record_end_time: this.formValidate.record_end_time,
                    state: '手动'
                  }
                  
                }
                operationDomain(formData, this.modalEditData.action).then(res => {
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
    }
  },
  //
  watch: {
    domainData (value) {
      this.formValidate = value
    }
  },
  //
  mounted() {
  }
  //
}
</script>