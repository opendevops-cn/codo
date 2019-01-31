<template>
<div>
  <Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true @on-cancel="handleCancel">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="项目代号" prop="project_code">
            <Input v-model="formData.project_code" :maxlength=18 placeholder="项目英文名称或者代号"></Input>
        </FormItem>
        <FormItem label="项目名称" prop="project_name">
            <Input v-model="formData.project_name" :maxlength=18 placeholder="项目中文名"></Input>
        </FormItem>

        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
  </Modal>
</div>
</template>
<script>
import { addProject } from '@/api/confd/project.js'
export default {
  name: 'add',
  data () {
    return {
      ruleValidate: {
        project_code: [
          { required: true, message: '项目代号不能为空', trigger: 'blur' },
          { type: 'string', max: 18, message: '超出最大长度', trigger: 'change' }
        ],
        project_name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { type: 'string', max: 18, message: '超出最大长度', trigger: 'change' }
        ]
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
          addProject(this.formData).then(res => {
            if (res.data.code === 0) {
              this.$Message.success({
                content: res.data.msg,
                duration: 3
              })
              this.$emit('e-close')
              this.$emit('e-update')
            } else {
              this.$Message.error({
                content: res.data.msg,
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
    }
  },
  props: {
    dialog: Object,
    formData: Object
  }

}
</script>
