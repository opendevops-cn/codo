<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true @on-cancel="handleCancel">
    <Form ref="formData3" :model="formData" :label-width="80">
        <Alert type="success">格式: [HOST] [PORT] [USERNAME] [PASSWORD]</Alert>
        <!-- <FormItem label="批量添加"> -->
            <Input v-model="formData.data" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="1.1.1.1 3306 root 123456"></Input>
        <!-- </FormItem> -->
        <!-- <FormItem> -->
            <br><br>
            <Button type="primary" @click="handleSubmit('formData3')">提交</Button>
            <Button @click="handleReset('formData3')" style="margin-left: 8px">重置</Button>
        <!-- </FormItem> -->
    </Form>
</Modal>
  <!-- </Card>     -->
<!-- </div> -->
</template>
<script>
import { multiAdd } from '@/api/cmdb/db'
export default {
  name: 'multiadd',
  data () {
    return {
      ruleValidate: {
        hostname: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      if (this.formData.data !== null) {
        const new_data = this.formData.data.split('\n')
        console.log(new_data)
        multiAdd(new_data).then(res => {
          console.log(res)
          if (res.data.status) {
            this.$Message.success({
              content: 'Success!',
              duration: 3
            })
            this.$emit('e-close')
            this.$emit('e-update')
          } else {
            this.$Message.error({
              content: res.data.msg,
              duration: 10
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
          content: '不能为空',
          duration: 3
        })
      }
    },
    handleCancel () {
      this.$emit('e-close')
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }

  },
  props: {
    dialog: Object,
    formData: Object
  },
  mounted () {

  }
}
</script>
