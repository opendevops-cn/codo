<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="1024px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true @on-cancel="handleCancel" :mask-closable=false :styles="{top: '5px',right:'-10%'}">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="项目">
            <Input v-model="display_name" disabled></Input>
        </FormItem>
        <FormItem label="环境" prop="environment">
          <Select v-model="formData.environment" filterable allow-create @on-create="handleCreate" placeholder="请选择环境，也可以自定义环境名称，不过尽量避免使用中文。">
           <Option v-for="item in envList" :value="item" >{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务名" prop="service">
            <Input v-model="formData.service" placeholder="如: nginx"></Input>
        </FormItem>
        <FormItem label="文件名" prop="filename">
            <Input v-model="formData.filename" placeholder="如: nginx.conf"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
            <editor v-model="formData.content" :read="read" :mode_type="mode_type" :editorHeight=550></editor>
        </FormItem>


        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</Modal>
  <!-- </Card>     -->
<!-- </div> -->
</template>
<script>
import editor from '@/components/public/editor'
import { postConf } from '@/api/confd/conf.js'
export default {
  name: 'add',
  components: { editor },
  props: {
    dialog: Object,
    display_name: String,
    wordList: Array,
    project_code: String
  },
  data () {
    return {
      mode_type : 'python',
      read: false,
      formData: {
        content:'',
        environment: null,
        service: null,
        filename: null
      },
      envList: ['dev', 'qa', 'staging', 'pre', 'sandbox', 'gray', 'release', 'hidden', 'public', 'deployment', 'android', 'apple', 'wechat'],
      ruleValidate: {
        service: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
        filename: [{ required: true, message: '文件名称不能为空', trigger: 'blur' }],
        environment: [{ required: true, message: '环境必须要勾选', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }, 
                  { type: 'string', max: 60000, message: '不能超过60000个字节', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleCancel () {
      this.$emit('e-close')
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formData['project_code'] = this.project_code
          postConf(this.formData).then(res => {
            const data = res.data
            // console.log(data)
            if (data.code ===0 ) {
              this.$Message.success({
                content: data.msg,
                duration: 3
              })
              this.$emit('e-close')
              this.$emit('e-update')
            } else {
              this.$Message.error({
                content: data.msg,
                duration: 3
              })
            }
          }).catch(error => {
            this.$Message.error({
              content: JSON.stringify(error.response.data),
              duration: 10
            })
          })
        } else {
          this.$Message.error({
            content: '请检查必选项',
            duration: 3
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.formData.content = null
    },
    handleCreate(val) {
      this.envList.push(val);
    }
  }

}
</script>
